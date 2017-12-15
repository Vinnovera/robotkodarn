import React from 'react'

import { SortableContainer } from 'react-sortable-hoc'

import SortableItem from '../SortableItem'

import styles from '../partlist.css'

const SortableList = SortableContainer(({
  parts,
  editing,
  editingPartIndex,
  handleFormSubmit,
  handleInputChange,
  inputValue,
  activePartIndex,
  currentEditingType,
  deletePromptIndex,
  deleteHandleClickConfirm,
  deleteHandleClickCancel,
  editPartHandleClick,
  changePartHandleClick,
  deletePartHandleClick }) => {
  return (
    <ul className={`${styles.partList} ${editing ? styles.editingMode : ''}`}>
      {parts.map((part, index) => (
        <SortableItem
          key={part._id}
          index={index}
          partIndex={index}
          part={part}
          editingPartIndex={editingPartIndex}
          handleFormSubmit={handleFormSubmit}
          handleInputChange={handleInputChange}
          inputValue={inputValue}
          activePartIndex={activePartIndex}
          currentEditingType={currentEditingType}
          deletePromptIndex={deletePromptIndex}
          deleteHandleClickConfirm={deleteHandleClickConfirm}
          deleteHandleClickCancel={deleteHandleClickCancel}
          editPartHandleClick={() => editPartHandleClick(index)}
          changePartHandleClick={() => changePartHandleClick(index)}
          deletePartHandleClick={() => deletePartHandleClick(index)}
        />
      ))}
    </ul>
  )
})

export default SortableList
