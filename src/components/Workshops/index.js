import React, { Component } from 'react'
import { connect } from 'react-redux'
import FA from 'react-fontawesome'

import { checkAuthorization } from '../../actions/authentication'
import {
  getWorkshopsByUserId,
  copyWorkshop,
  removeWorkshop
} from '../../actions/workshops'

import View from '../View'
import Button from '../Button'
import styles from './workshops.css'

class Workshops extends Component {
  componentWillMount() {
    this.props.dispatch(checkAuthorization('/workshops'))
    this.props.dispatch(getWorkshopsByUserId())
  }

  handleWorkshop = async (event) => {
    event.preventDefault()
    const { value, name } = event.currentTarget

    try {
      if (name === 'edit') {
        console.log('du vill editera workshop med pin', value)
      } else if (name === 'copy') {
        await this.props.dispatch(copyWorkshop(value))
        this.props.dispatch(getWorkshopsByUserId())
      } else if (name === 'delete') {
        await this.props.dispatch(removeWorkshop(value))
        this.props.dispatch(getWorkshopsByUserId())
      }
    } catch (error) {
      console.log(error)
    }
  }

  createWorkshop = async (event) => {
    event.preventDefault()
    console.log('du vill skapa en ny workshop!')
  }


  render() {
    const workshops = this.props.userWorkshops
    return (
      <View>
        <div className={styles.workshops}>
          <h2 className={styles.workshopHeadline}>Dina workshops</h2>
          <form className={styles.form} method="post">
            <table className={styles.workshopTable}>
              <thead>
                <tr>
                  <th>Namn</th>
                  <th>Pinkod</th>
                  <th>Kopiera</th>
                  <th>Radera</th>
                </tr>
              </thead>
              <tbody>
                {workshops.map((workshop) => {
                  return (
                    <tr className={styles.workshopItem} key={workshop._id}>
                      <td>{workshop.title}</td>
                      <td>{workshop.pincode}</td>
                      <td>
                        <button onClick={this.handleWorkshop} type="submit" className={styles.tableIcon} value={workshop._id} name="copy">
                          <FA name="clone" />
                        </button>
                      </td>
                      <td>
                        <button onClick={this.handleWorkshop} type="submit" className={styles.tableIconDanger} value={workshop._id} name="delete">
                          <FA name="times" />
                        </button>
                      </td>
                    </tr>
                  )
                }
                )}
              </tbody>
            </table>
            <div className={styles.buttonContainer}>
              <Button handleClick={this.createWorkshop}>Skapa ny</Button>
            </div>
          </form>
        </div>
      </View>
    )
  }
}

function mapStateToProps(state) {
  return {
    userWorkshops: state.adminpage.userWorkshops,
    selectedWorkshopIndex: state.adminpage.selectedWorkshopIndex,
    message: state.adminpage.message,
    role: state.user.isLoggedIn,
    view: state.admin.view
  }
}

export default connect(mapStateToProps)(Workshops)
