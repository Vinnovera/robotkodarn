import React from 'react'
import FA from 'react-fontawesome'

import { SortableElement, SortableHandle } from 'react-sortable-hoc'

import styles from '../partlist.css'

const DragHandle = SortableHandle(() => <span className={styles.sortHandler}><FA name="bars" /></span>)

const SortableItem = SortableElement(({ ...props }) => {
	return (props.editingPartIndex === props.partIndex) ? (
		<li className={styles.editing} key={props.key}>
			<DragHandle />
			<form onSubmit={props.handleFormSubmit}>
				<button type="submit" className={styles.editPartButton}>
					<FA className={styles.pencilIcon} name="pencil" />
					<FA className={styles.diskIcon} name="save" />
				</button>
				<input autoFocus onBlur={(props.handleFormSubmit)} onChange={props.handleInputChange} type="text" value={props.inputValue} />
				<button className={`${styles.deletePartButton} ${styles.deletePartButtonRemove}`}><FA className={styles.codeIcon} name="trash-o" /></button>
			</form>
		</li>
	) : (
		<li className={(props.activePartIndex === props.partIndex && props.currentEditingType === 'part') ? styles.activePart : ''} key={props.key}>
			<DragHandle />
			{
				(props.deletePromptIndex === props.partIndex) && (
					<div className={styles.deletePromptWrapper}>
						<p>
							Radera övning?
							<span>
								<button onClick={props.deleteHandleClickConfirm}><FA className={styles.codeIcon} name="check-circle" /></button>
								<button onClick={props.deleteHandleClickCancel}><FA className={styles.codeIcon} name="times-circle" /></button>
							</span>
						</p>
					</div>
				)
			}
			<button className={styles.editPartButton} onClick={props.editPartHandleClick}><FA className={styles.codeIcon} name="pencil" /></button>
			<button className={styles.changePartButton} onClick={props.changePartHandleClick}>{props.part.title}</button>
			<button className={styles.deletePartButton} onClick={props.deletePartHandleClick}><FA className={styles.codeIcon} name="trash-o" /></button>
		</li>
	)
})

export default SortableItem
