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
					props.userWorkshops.map((workshop, i) => {
						return (
							<tr className={`${props.styles.workshopItem} ${!workshop.isPublished ? props.styles.isNotPublished : ''}`} key={workshop._id}>
								<td>
									<Link onClick={() => props.toggleEditing(true)} className={props.styles.tableLink} to={`/id/${workshop.pincode}`}>
										{workshop.title} { !workshop.isPublished && <span>(ej publicerad)</span> }
									</Link>
								</td>
								<td className={props.styles.pin}>{workshop.isPublished ? workshop.pincode : 'XXXX'}</td>
								<td>
									<button onClick={e => props.copyWorkshop(e, workshop._id)} type="submit" className={props.styles.tableIcon} value={workshop._id} name="copy">
										<FA name="clone" />
									</button>
								</td>
								<td>
									{
										(props.deletePromptIndex === i)
											? (
												<div className={props.styles.deletePromptWrapperParent}>
													<div className={props.styles.deletePromptWrapper}>
														<p>
															Radera workshop?
															<span>
																<button onClick={e => props.deleteHandleClickConfirm(e, workshop._id)}><FA className={props.styles.codeIcon} name="check-circle" /></button>
																<button onClick={props.deleteHandleClickCancel}><FA className={props.styles.codeIcon} name="times-circle" /></button>
															</span>
														</p>
													</div>
												</div>
											)
											: ''
									}
									<button onClick={e => props.promptForDeletion(e, workshop._id, i)} type="submit" className={props.styles.tableIcon} value={workshop._id} name="delete">
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
