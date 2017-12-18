import React from 'react'
import FA from 'react-fontawesome'

import { SortableElement, SortableHandle } from 'react-sortable-hoc'

import styles from '../linklist.css'

const DragHandle = SortableHandle(() => <span className={styles.sortHandler}><FA name="bars" /></span>)

const SortableItem = SortableElement(({ ...props }) => {
  return (props.editingLinkIndex === props.linkIndex) ? (
    <li className={styles.editing} key={props.key}>
      <DragHandle />
      <form onSubmit={props.handleFormSubmit}>
        <button type="submit" className={styles.editLinkButton}>
          <FA className={styles.pencilIcon} name="pencil" />
          <FA className={styles.diskIcon} name="save" />
        </button>
        <input autoFocus onBlur={(props.handleFormSubmit)} onChange={props.handleInputChange} type="text" value={props.inputValue} />
        <button className={`${styles.deleteLinkButton} ${styles.deleteLinkButtonRemove}`}><FA className={styles.codeIcon} name="trash-o" /></button>
      </form>
    </li>
  ) : (
    <li className={(props.activeLinkIndex === props.linkIndex && props.currentEditingType === 'link') ? styles.activeLink : ''} key={props.key}>
      <DragHandle />
      {
        (props.deletePromptIndex === props.linkIndex) && (
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
      <button className={styles.editLinkButton} onClick={props.editLinkHandleClick}><FA className={styles.codeIcon} name="pencil" /></button>
      <button className={styles.changeLinkButton} onClick={props.changeLinkHandleClick}>{props.link.title}</button>
      <button className={styles.deleteLinkButton} onClick={props.deleteLinkHandleClick}><FA className={styles.codeIcon} name="trash-o" /></button>
    </li>
  )
})

export default SortableItem
