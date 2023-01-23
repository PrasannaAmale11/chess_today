import React from 'react'

import ChessWebAPI from "chess-web-api"

export class ApiContent extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			count: 0,
			displayMonth: null,
			displayYear: null,
			games: [],
			isDisplay: false,
			loading: false,
			preLoading: false,
			spinner: true,
		}
		this.api = new ChessWebAPI({ queue: true})
		this.stop = false
	}

	
	componentDidUpdate = async (prevProps, prevState) => {
		let { isFetch, getLink, navigate, location } = this.props
		let { username, startDate, endDate } = this.props.inputs
		let { loading } = this.state

		if (isFetch !== prevProps.isFetch && isFetch) {
			let res = await this.fetchPlayerData(username)
			let player = this.getPlayer(res)
			if (!player) { return this.props.handleError(true, res, null, false) } 

			let res2 = await this.fetchPlayerStats(username)
			let player2 = this.getPlayer(res2)

			this.props.handlePlayer({...player, ...player2})
			// if player is found, reset API and then go look for games
			this.setApi(0, null, null, [], true, false, true, false, () => { 	// reset API state				
			
				this.fetchAndProcessGames(startDate, endDate, player, username)
			
				
			})
		}

		// if game is found then loading is set to true, navigate to game link
		if (loading !== prevState.loading && loading) {
			this.props.handlePage(0, () => {
				if (location.pathname.slice(1,6) !== "games")
					navigate(getLink(username, startDate, endDate, 1))	// navigate to page 1
			})
		}

		// after clicking stop and setting to true, this.stop gets toggled right back to false
		if (!loading && this.stop === true) {
			this.stop = false
		}
	}

	// this rendering really needs design work!
	render() {
		let {  count, loading, isDisplay, preLoading } = this.state

		return (
			<div className="mt-md-2 text-start">
				{/*Display fetching */}
				{isDisplay &&
				<div className="row">
					
					<div className="col-6">
						{(loading || preLoading) &&
						"Loading...." 
						}
					</div>
					<div className="col-6">					
						<h6>
							
							{loading || preLoading ? 
							<span> Fetching </span> 	:
							<span> Fetched </span>	}
							({count})
						</h6>
					</div>
					
				</div>
				}

				{/*End Display */}
			</div>
		)
	}


	/* 1. fetchPlayerData (x)
		return: <promise> response
	*/
	fetchPlayerData = async player => {
		let response 
		try {
			response = await this.api.getPlayer(player)
		} catch (err) {
			response = err
		}
		return response
	}

	fetchPlayerStats = async (player) => {
		let res
		try {
			res = await this.api.getPlayerStats(player) // gets chess.com username to display on display card on side
		} catch (err) {
			res = err
		}
		return res
	}

	// 2. processFetchGames gets the necessary params before invoking fetchAndSetGames
	fetchAndProcessGames = async (startDate, endDate, player, username) => {
		let today = new Date()
		if (endDate > today) endDate = today

		let dates = this.getDates(startDate, endDate, player, this.props.extractDate)

		// Used to fetch games
		this.joinedMonth = dates.joinedDate.month
		this.joinedYear = dates.joinedDate.year

		this.api.dispatch(
			this.api.getPlayerCompleteMonthlyArchives, 
			this.fetchAndSetGames, 
			[username, dates.endDate.year, dates.endDate.month], {},
			[username, dates.endDate.year, dates.endDate.month, dates.startDate.year, dates.startDate.month]
		)
	}

	// 3. stopBtn -purpose: Stops fetching, in case of recursion issues or overflow or lag
	stopBtn = async (e) => 
	{
		this.stop = true
	}

	// 4. fetchAndSetGames from  https://www.npmjs.com/package/chess-web-api
	fetchAndSetGames = (response, error, username, endYear, endMonth, startYear, startMonth) => {
		// January is tricky, because it gets set back to December
	    if 	(((endYear <= startYear) && (endMonth < startMonth)) || 
	    	((endYear <= this.joinedYear) && (endMonth < this.joinedMonth)) ||
	    	((endYear < startYear)) || (this.stop)) {
	    	return this.setState({
	    		preLoading: false,
	    		loading: false,
	    	}, () => {
	    		this.props.handleFetching(false)
	    	})
	    }
		if (error || !response || !response.body) {
			return this.setState({
				preLoading: false,
				loading: false,
			}, () => { 
				this.props.handleError(true, error, null, false) 
			})
		}
		// Logics start here: setting games to parent component
		this.props.handleGames(response.body.games, (gamesLength) => {
			let jsonObj = {
				id: this.state.games.length+1,
				month: `${endMonth}`,
				year: `${endYear}`,
				games: response.body.games 
			}
			// setting games to this component
			let count = this.state.count + response.body.games.length
			let month = this.toMonthName(endMonth)
			let games = [...this.state.games, jsonObj]
			let loading = gamesLength > 0
			let spinner = !this.state.spinner
			this.setApi(count ,month, endYear, games, true, true, false, spinner, () => {
			    // Going backwards one month
			    if (endMonth === 1) {
			    	endMonth = 12
			    	endYear-= 1
			    } else {
			    	endMonth -=1
			    }
			    // recursive call
			    this.api.dispatch(
			    	this.api.getPlayerCompleteMonthlyArchives, 
			    	this.fetchAndSetGames, 
			    	[username, endYear, endMonth], {},
			    	[username, endYear, endMonth, startYear, startMonth]
			    )
			})
		})
	}

	fixChessDate = (ms) => new Date(+(ms.toString() + "000"))

	
	getPlayer = (res) => {
		if (res.statusCode === 404) {
			console.log('>>>>>>', res)
			return this.props.handleError(true, res, null, false)
		}
		if (res.statusCode !== 200) {
			console.log('>>>>>>', res)
			return this.props.handleError(true, res, null, false)
		}
		return res.body
	}

	
	getDates = (startDate, endDate, joinedDate, extractDate) => ({
			joinedDate: extractDate(this.fixChessDate(joinedDate.joined)),
			startDate: extractDate(startDate),
			endDate: extractDate(endDate)
	})

	// setApi (x) - Helper Method
	setApi = (count, displayMonth, displayYear, games, isDisplay, loading, preLoading, spinner, cb) => {
		this.setState({ count, displayMonth, displayYear, games, isDisplay, loading, preLoading, spinner}, () => {
			cb()
		})
	}

	// toMonthName (x) - https://bobbyhadz.com/blog/javascript-convert-month-number-to-name
	toMonthName(monthNumber) {
		let date = new Date()
		date.setMonth(monthNumber -1)

		return date.toLocaleString([], {
			month: 'short',
		})
	}

	


	
}

export default ApiContent