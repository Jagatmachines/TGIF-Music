import React from "react"
import BootstrapTable from "react-bootstrap-table-next"
import GroupAddForm from "./GroupAddForm"
import Instruction from "./Instruction"
import { fetchGroupName, setGroupName } from "../actions"
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit"

class GroupTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      groupAddForm: false,
      instuction: false,
      products: [],
    }
  }

  componentDidMount() {
    fetchGroupName().then(values => {
      this.setState({
        products: Object.values(values),
      })
    })
  }

  handleGroupAddFormModal = () => {
    this.setState({
      groupAddForm: !this.state.groupAddForm,
    })
  }

  handleInstructionModal = () => {
    this.setState({
      instuction: !this.state.instuction,
    })
  }

  setGroupName = async values => {
    setGroupName(values).then(() => {
      this.handleGroupAddFormModal()
      fetchGroupName().then(values => {
        this.setState({
          products: Object.values(values),
        })
      })
    })
  }

  rowEvents = {
    onClick: (e, row, rowIndex) => {
      this.props.history.push(`/group?id=${row.groupId}`)
    },
  }

  indication = () => {
    return "No Data Found"
  }

  render() {
    const { SearchBar } = Search
    const { products } = this.state
    const columns = [
      {
        dataField: "sNo",
        text: "SNo.",
        formatter: (cell, row, index) => ++index,
      },
      {
        dataField: "groupId",
        text: "Group ID",
      },
      {
        dataField: "groupName",
        text: "Group Name",
      },
      {
        dataField: "createdBy",
        text: "Created By",
      },
      {
        dataField: "createdOn",
        text: "Created On",
      },
    ]
    const { groupAddForm, instuction } = this.state

    return (
      <div className="container">
        <div className="d-flex flex-row-reverse">
          <div className="p-2">
            <button className="btn btn-primary" onClick={this.handleInstructionModal}>
              Instruction
            </button>
          </div>
          <div className="p-2">
            <button className="btn btn-primary" onClick={this.handleGroupAddFormModal}>
              Add Group
            </button>
          </div>
        </div>

        <div className="row">
          <ToolkitProvider keyField="groupId" data={products} columns={columns} search>
            {searchProps => (
              <React.Fragment>
                <SearchBar {...searchProps.searchProps} />
                <BootstrapTable
                  {...searchProps.baseProps}
                  striped
                  hover
                  condensed
                  noDataIndication={this.indication}
                  rowEvents={this.rowEvents}
                />
              </React.Fragment>
            )}
          </ToolkitProvider>
        </div>
        <GroupAddForm
          setGroupName={this.setGroupName}
          groupAddForm={groupAddForm}
          handleGroupAddFormModal={this.handleGroupAddFormModal}
        />
        <Instruction instuction={instuction} handleInstructionModal={this.handleInstructionModal} />
      </div>
    )
  }
}

export default GroupTable
