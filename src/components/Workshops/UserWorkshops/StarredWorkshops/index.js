import React from 'react'
import FA from 'react-fontawesome'
import { Link } from 'react-router'

const StarredWorkshops = ({ ...props }) => {
	return (
		<table className={props.styles.workshopTable}>
			<thead>
				<tr>
					<th>Namn</th>
					<th>Pinkod</th>
					<th>Kopiera</th>
					<th>Radera</th>
				</tr>
			</thead>
			<tbody>
				{
					props.userWorkshops.map((workshop) => {
						return (
							<tr className={props.styles.workshopItem} key={workshop._id}>
								<td><Link onClick={props.startEditing} className={props.styles.tableLink} to={`/id/${workshop.pincode}`}>{workshop.title}</Link></td>
								<td>{workshop.pincode}</td>
								<td>
									<button onClick={props.handleWorkshop} type="submit" className={props.styles.tableIcon} value={workshop._id} name="copy">
										<FA name="clone" />
									</button>
								</td>
								<td>
									<button onClick={props.handleWorkshop} type="submit" className={props.styles.tableIconDanger} value={workshop._id} name="delete">
										<FA name="times" />
									</button>
								</td>
							</tr>
						)
					})
				}
			</tbody>
		</table>
	)
}

export default StarredWorkshops
