import React from "react"
import { NavLink } from "react-router-dom"
import { FaCaretDown, FaCaretUp } from "react-icons/fa"
import '../index.css'

export class Sidebar extends React.Component {
	constructor(props) {
		super(props) // location is passed down as prop
		this.state = {
			toggle: true
		}
	}

	render() {
		return (
			<>
		
			
				<div className="text-center text-lg-start border-bottom p-1 color-white">
					<div 
						className="sidebar-heading" 
						data-bs-toggle="collapse" 
						data-bs-target="#sidemenu"
						role="button"
						aria-expanded="true"
						aria-controls="collapseSidebar"
						onClick={this.toggle}>
						{this.getName(this.props.location.pathname.toLowerCase())}
						<span>
							{this.state.toggle 	? 
							<FaCaretDown /> 	:
							<FaCaretUp /> 		}
						</span>
					</div>
				</div>
			
			{/* SIdebar Heading End */}

			{/* Sidebar Content */}
			<div className="sidebar-container color-white">
				<div className="show" id="sidemenu">
					<div className="list-group">
								
						<NavLink id="games-sidebar"
							to="games" 
							className="list-group-item list-group-item-action sidebar-games">
							Games
						</NavLink>
						
						
					</div>
				</div>
			</div>
			{/* End Sidebar Content */}
			</>
		)
	}


	toggle = () => {
		// console.log(this.state)
		this.setState({ toggle: !this.state.toggle })
	}

	// helper method
	getName = (pathname) => {
		if (pathname.match("/games")) {
			return "Games"
		}  else if (pathname.match("/about")) {
			return "About"
		} else if (pathname.match("/") && pathname.match("/").input === "/") {
			return "Home"
		}  else {
			return "404"
		}
	}


}

export default Sidebar