import React from 'react'

export class ErrorMessage extends React.Component {
	render(props) {
		return (
			<div>
			    
				{this.props.error.value &&
				<div className="alert alert-danger" role="alert" >
					{this.props.error.message}
				</div>
				}
			</div>
		)
	}
}

export default ErrorMessage