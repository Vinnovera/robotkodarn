import React from 'react'
import FA from 'react-fontawesome'

import { SortableElement, SortableHandle } from 'react-sortable-hoc'

import styles from '../partlist.css'

const DragHandle = SortableHandle(() => <span className={styles.sortHandler}><FA name="bars" /></span>)

const SortableItem = SortableElement(({
  key,
  index,
  partIndex,
  part,
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
  deletePartHandleClick
}) => {
  return (editingPartIndex === partIndex) ? (
    <li className={styles.editing} key={key}>
      <DragHandle />
      <form onSubmit={handleFormSubmit}>
        <button type="submit" className={styles.editPartButton}>
          <FA className={styles.pencilIcon} name="pencil" />
          <FA className={styles.diskIcon} name="save" />
        </button>
        <input autoFocus onChange={handleInputChange} type="text" value={inputValue} />
        <button className={`${styles.deletePartButton} ${styles.deletePartButtonRemove}`}><FA className={styles.codeIcon} name="trash-o" /></button>
      </form>
    </li>
  ) : (
    <li className={(activePartIndex === partIndex && currentEditingType === 'part') ? styles.activePart : ''} key={key}>
      <DragHandle />
      {
        (deletePromptIndex === partIndex) && (
          <div className={styles.deletePromptWrapper}>
            <p>
              Radera övning?
              <span>
                <button onClick={deleteHandleClickConfirm}><FA className={styles.codeIcon} name="check-circle" /></button>
                <button onClick={deleteHandleClickCancel}><FA className={styles.codeIcon} name="times-circle" /></button>
              </span>
            </p>
          </div>
        )
      }
      <button className={styles.editPartButton} onClick={editPartHandleClick}><FA className={styles.codeIcon} name="pencil" /></button>
      <button className={styles.changePartButton} onClick={changePartHandleClick}>{part.title}</button>
      <button className={styles.deletePartButton} onClick={deletePartHandleClick}><FA className={styles.codeIcon} name="trash-o" /></button>
    </li>
  )
})

export default SortableItem
