import React from 'react'
import FA from 'react-fontawesome'
import { Link } from 'react-router'

const MyWorkshops = ({ ...props }) => {
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
								<td><Link onClick={props.toggleEditing} className={props.styles.tableLink} to={`/id/${workshop.pincode}`}>{workshop.title}</Link></td>
								<td>{workshop.pincode}</td>
								<td>
									<button onClick={e => props.copyWorkshop(e, workshop._id)} type="submit" className={props.styles.tableIcon} value={workshop._id} name="copy">
										<FA name="clone" />
									</button>
								</td>
								<td>
									<button onClick={e => props.deleteWorkshop(e, workshop._id)} type="submit" className={props.styles.tableIcon} value={workshop._id} name="delete">
										<FA name="trash-o" />
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

export default MyWorkshops
