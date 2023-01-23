import "./index.css"

import React from "react"
import { Route, Routes } from "react-router-dom"

import { withRouter } from "./utilities/withRouter"
import ErrorMessage from "./ErrorMessage"

import Home from "./Home"
import About from "./About"
import Navbar from "./bar-component/Navbar"
import Sidebar from "./bar-component/Sidebar"
import Searchbar from "./bar-component/Searchbar"
import ApiContent from "./ApiContent"
import Player from "./Player"

import GamesWrapper from "./game-component/GamesWrapper"





export class App extends React.Component {
	constructor(props) {
		super(props) 

		this.state = {
			error: { value: false, message: "", },
			inputs: { username: null, startDate: null, endDate: null, },
			isFetch: false,
			player: {},

			// gameswrapper
			pageIndex: 0,
			games: [],

			
			chesscom: null,
		}
	}
	componentDidMount() {
		document.title = "ChessToday"
	}
	componentDidUpdate(prevProps, prevState) {
		this.clearErrorOnPathChange(prevProps.location.pathname)
	}
	clearErrorOnPathChange = (prevLocation) => {
		if (prevLocation !== this.props.location.pathname) 
			if (this.state.error.value) this.handleError(false, "")
	}
	render() {
		const { location, navigate } = this.props
		const { games, isFetch, error, inputs, pageIndex, player, } = this.state



		const { 
			handleError, 
			handleUserSearch, 
			handlePlayer, 
			
			handleFetching, 
			extractDate, 
			getLink, 
			handlePage, 
			handleGames, 
			handleGameClick, 
			fixChessDate,
			
		} = this

		const ErrorProps = { error }
		const NavbarProps = { location }
		const SidebarProps = { location }
		const SearchbarProps = { handleUserSearch, handleError }
		const PlayerProps = { extractDate, fixChessDate, handlePlayer }
		const ApiContentProps = { handleError, handleFetching, handlePage, handlePlayer, extractDate, getLink, handleGames, location, navigate}

		return (<>
		
			<Navbar {...NavbarProps} />
	

			<div className="container">
				<div className="row">

					<div className="col-lg-3">
						<Sidebar {...SidebarProps} />
					
		    		<Player player={player} {...PlayerProps} />

	    	    	<ApiContent isFetch={isFetch} inputs={inputs} {...ApiContentProps} />
	    		   
						
					</div>

					<div className="col-lg-9">


						
				    	<ErrorMessage {...ErrorProps} />
						

				    	<Searchbar inputs={inputs} isFetch={isFetch} {...SearchbarProps} />
					   

					 
						<div className="mt-2">
							<Routes>
								<Route
									path="*"
									element={<h2>404</h2>} />
								<Route exact path="/" element={<Home />} />
								<Route 
									path="games"
									element={<GamesWrapper
										games={games}
										pageIndex={pageIndex}
										handlePage={handlePage}
										extractDate={extractDate} 
										handleGameClick={handleGameClick} />} />
							
								<Route 
									path="about"
									element={<About />} />
								
							</Routes>
						</div>
						
					</div>
				</div>
			</div>
	</>)
	}

	
	handleError = (value, message, cb, isFetch) => {
		if (!isFetch) this.setState({ isFetch: false })

		if (!value && !this.state.error.value && !cb) return
		if (!value && !this.state.error.value && cb) return cb()
		message = this.checkMessage(message)
		return this.setState(({error}) => ({ 
			error: { ...error, value, message }
		}), () => { if (cb) cb() })
	}

	
	handleUserSearch = (username, startDate, endDate) => {
		this.setState(({inputs}) => ({
			inputs: {...inputs, username, startDate, endDate},
			isFetch: true,
			games: []
		}))
	}

	
	handlePlayer = (player, cb) => {
		this.setState({player: player}, () => { if (cb) cb() })
	}

	
	handleFetching = (isFetch, cb) => {	
		this.setState({ isFetch }, () => { if (cb) cb() })
	}

	
	handleGames = (games, callback) => {
		this.setState({
			games: [...this.state.games, ...games.slice().reverse()]
		}, (val) => {
			if (callback) callback(this.state.games.length)
		})
	}

	
	extractDate = (date) => {
		return {
			month: parseInt(date.toLocaleString('default', { month: 'numeric' })),
			year: parseInt(date.toLocaleString('default', { year: 'numeric' })),
			monthYear: date
				.toLocaleString('default', { month: 'short', year: 'numeric' })
				.replace(' ', '-')
		}
	}

	// isJSON  got from stackoverflow
	isJSON = (str) => {
	    if( typeof( str ) !== 'string' ) { 
	        return false;
	    }
	    try {
	        JSON.parse(str);
	        return true;
	    } catch (e) {
	        return false;
	    }
	}

	// used in apicontent as well
	fixChessDate = (ms) => new Date(+(ms.toString() + "000"))

}

export default withRouter(App)
