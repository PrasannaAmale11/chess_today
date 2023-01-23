import React, { Component } from "react"
import { NavLink } from "react-router-dom"

export class Navbar extends Component {
	render() {
		let location = this.props.location
		return (
			<nav className="navbar navbar-expand-md bg-dark navbar-dark navbar-style ">
				<div className="container-fluid">

				{
					location.pathname === "/" ?
					<NavLink to="/" className="navbar-brand nav-link">ChessToday</NavLink> :
					<NavLink to="/" className="navbar-brand">ChessToday</NavLink>
				}

					<button 
						className="navbar-toggler" 
						type="button" 
						data-bs-toggle="collapse" 
						data-bs-target="#navmenu"
					>
						<span className="navbar-toggler-icon">
						</span>
					</button>
					<div className="collapse navbar-collapse" id="navmenu">
						<ul className="navbar-nav me-auto mb-2 mb-lg-0">
						<li className="nav-item">
								{/* <NavLink 
									to="home" 
									className="navbar-brand nav-link">
									Home
								</NavLink> */}
							</li>

							<li className="nav-item">
								<NavLink 
									to="games" 
									className="navbar-brand nav-link">
									Games
								</NavLink>
							</li>
							
						</ul>
					</div>
				</div>
			</nav>
		)
	}
}

export default Navbar