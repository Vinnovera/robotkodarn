import React from 'react'

import { SortableContainer } from 'react-sortable-hoc'

import SortableItem from '../SortableItem'

import styles from '../linklist.css'

const SortableList = SortableContainer(({ ...props }) => {
  return (
    <ul className={`${styles.linkList} ${props.editing ? styles.editingMode : ''}`}>
      {props.links.map((link, index) => (
        <SortableItem
          key={link._id}
          index={index}
          linkIndex={index}
          link={link}
          editingLinkIndex={props.editingLinkIndex}
          handleFormSubmit={props.handleFormSubmit}
          handleInputChange={props.handleInputChange}
          inputValue={props.inputValue}
          activeLinkIndex={props.activeLinkIndex}
          currentEditingType={props.currentEditingType}
          deletePromptIndex={props.deletePromptIndex}
          deleteHandleClickConfirm={props.deleteHandleClickConfirm}
          deleteHandleClickCancel={props.deleteHandleClickCancel}
          editLinkHandleClick={() => props.editLinkHandleClick(index)}
          changeLinkHandleClick={() => props.changeLinkHandleClick(index)}
          deleteLinkHandleClick={() => props.deleteLinkHandleClick(index)}
        />
      ))}
    </ul>
  )
})

export default SortableList
