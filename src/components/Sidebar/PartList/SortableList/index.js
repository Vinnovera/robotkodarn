import React from 'react'

import FA from 'react-fontawesome'

import { SortableContainer } from 'react-sortable-hoc'

import SortableItem from '../SortableItem'

import styles from '../partlist.css'

const SortableList = SortableContainer(({ ...props }) => {
	return (
		<ul className={`${styles.partList} ${props.editing ? styles.editingMode : ''}`}>
			{props.parts.map((part, index) => (
				<SortableItem
					key={part._id}
					index={index}
					partIndex={index}
					part={part}
					editingPartIndex={props.editingPartIndex}
					handleFormSubmit={props.handleFormSubmit}
					handleInputChange={props.handleInputChange}
					inputValue={props.inputValue}
					activePartIndex={props.activePartIndex}
					currentEditingType={props.currentEditingType}
					deletePromptIndex={props.deletePromptIndex}
					deleteHandleClickConfirm={props.deleteHandleClickConfirm}
					deleteHandleClickCancel={props.deleteHandleClickCancel}
					editPartHandleClick={() => props.editPartHandleClick(index)}
					changePartHandleClick={() => props.changePartHandleClick(index)}
					deletePartHandleClick={() => props.deletePartHandleClick(index)}
				/>
			))}
			{ props.isAddingPart && <li className={styles.cogLoader}><FA name="cog" /></li> }
		</ul>
	)
})

export default SortableList
