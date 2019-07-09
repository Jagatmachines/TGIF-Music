import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import GroupAddForm from './GroupAddForm'
import { fetchGroupName, setGroupName } from '../actions';

class GroupTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            groupAddForm: false,
            products: []
        }
    }

    componentDidMount() {
        fetchGroupName().then((values) => {
            this.setState({
                products: Object.values(values)
            })
        })
    }

    handleGroupAddFormModal = () => {
        this.setState({
            groupAddForm: !this.state.groupAddForm
        })
    }
    
    setGroupName = async (values) => {
        setGroupName(values).then(() => {
            this.handleGroupAddFormModal();
            fetchGroupName().then((values) => {
                this.setState({
                    products: Object.values(values)
                })
            })
        })
    }

    rowEvents = {
        onClick: (e, row, rowIndex) => {
            this.props.history.push(`/group?id=${row.groupId}`)
        }
    };

    indication = () => {
        return 'No Data Found'
    }

    render() {
        const { products } = this.state;
        const columns = [{
            dataField: 'sNo',
            text: 'SNo.',
            formatter: (cell, row, index) => ++index
        }, {
            dataField: 'groupId',
            text: 'Group ID'
        }, {
            dataField: 'groupName',
            text: 'Group Name'
        }, {
            dataField: 'createdBy',
            text: 'Created By'
        }, {
            dataField: 'createdOn',
            text: 'Created On'
        }];
        const { groupAddForm } = this.state;
        

        return (
            <div className="container">
                <div className="d-flex flex-row-reverse">
                    <div className="p-2">
                        <button className="btn btn-primary" onClick={this.handleGroupAddFormModal}>Add Group</button>
                    </div>
                </div>

                <div className="row">
                    <BootstrapTable
                        keyField='groupId' 
                        data={ products } 
                        columns={ columns }
                        striped
                        hover
                        condensed
                        noDataIndication={ this.indication }
                        rowEvents={ this.rowEvents } 
                    />    
                </div>
                <GroupAddForm setGroupName={this.setGroupName} groupAddForm={groupAddForm} handleGroupAddFormModal={this.handleGroupAddFormModal}/>
            </div>
        )
    }
}

export default GroupTable;