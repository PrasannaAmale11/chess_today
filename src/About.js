import React from 'react'

export class About extends React.Component {
	componentDidMount() {
		document.title = "ChessToday - About"
	}
	render() {
		return (
			<div className="text-center">
				<h4>About</h4>
			</div>
		)
	}
}

export default About