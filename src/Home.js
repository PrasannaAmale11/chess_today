import React from "react"

export class Home extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			width: 530,
			height: 315,
		}
	}

	componentDidMount() {
		document.title = "ChessToday"
		window.addEventListener("resize", this.resize);
		this.resize();
	}
	resize = () => {
		let display = document.getElementsByClassName("home-wrapper")[0]
	    this.setState({
	    	width: display.offsetWidth, height: display.offsetWidth/1.7777
	    });
	}
	componentWillUnmount() {
		window.removeEventListener("resize", this.resize);
	}

	render() {
		return (<>
			<div className="text-center mt-4 home-wrapper home_dec">
				<h2>Find your next chess opponent</h2>

				
				<div className="home_dec">
					<p>Click on Search-Bar to Search Player stats</p>
				</div>
			</div>
	</>)
	}
}

export default Home