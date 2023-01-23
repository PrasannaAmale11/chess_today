import React from 'react'

export class Player extends React.Component {
	render() {
		let { extractDate, fixChessDate } = this.props
		let player = this.props.player
		return (<>
    		{this.props.player.username &&


			<div className="card mt-lg-2 player_card" style={{maxWidth: "574px"}}>
				

				<div className="row">
					{player.avatar &&
					<div className="col-12 col-sm-6 col-lg-12 d-none d-sm-block">
						<div className="card-header">
							<img src={player.avatar} className="card-img-top" alt="Logo" />
						</div>

					</div>
					}

					<div className="col-12 col-sm-6 col-lg-12">
						<div className="card-body">
							

							<ul className="list-group">
					    		{player.joined &&
					    		<li className="list-group-item">
					    		    <p style={{margin: "0"}}><b>Join Date:</b> {extractDate(fixChessDate(player.joined)).monthYear}</p>
				    		    	<p style={{margin: "0"}}><b>Last Active:</b> {extractDate(fixChessDate(player.last_online)).monthYear}</p>
					    		</li>
				    			}
			    		    </ul>
					  	</div>
					</div>
				</div>
			</div>

    		}
    			
	</>)
	}
	

}

export default Player