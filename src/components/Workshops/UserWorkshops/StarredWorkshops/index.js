import React from 'react'
import FA from 'react-fontawesome'
import { Link } from 'react-router'

const StarredWorkshops = ({ ...props }) => {
	return (
		<table className={props.styles.workshopTable}>
			<thead>
				<tr>
					<th>Namn</th>
					<th>Redaktör</th>
					<th>Pinkod</th>
					<th className={props.styles.centered}>Kopiera</th>
					<th className={props.styles.centered}>Stjärnmärk</th>
				</tr>
			</thead>
			<tbody>
				{
					props.starredWorkshops.map((workshop) => {
						return (
							<tr className={props.styles.workshopItem} key={workshop._id}>
								<td><Link onClick={() => props.toggleEditing(false)} className={props.styles.tableLink} to={`/id/${workshop.pincode}`}>{workshop.title}</Link></td>
								<td>{workshop.author.name}</td>
								<td>{workshop.pincode}</td>
								<td>
									<button onClick={e => props.copyWorkshop(e, workshop._id)} type="submit" className={props.styles.tableIcon} value={workshop._id}>
										<FA name="clone" />
									</button>
								</td>
								<td>
									<button onClick={e => props.unstarWorkshop(e, workshop._id)} type="submit" className={props.styles.tableIcon}>
										<FA name="star" />
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
