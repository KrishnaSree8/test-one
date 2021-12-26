import React, {Component} from 'react';
import _ from 'lodash';
import DatePicker from './components/datePicker';
import moment from 'moment';

class HomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    async componentDidMount(){
        let list = await this.getFormatList()
        this.setState({
            listOfHolidays : list
        })

    }

    getFormatList = async () =>{
        let listOfHolidays =[]
        const url ='https://www.gov.uk/bank-holidays.json'
        let list = await (await fetch(url)).json();
        _.map(list, (value, key) =>{
            let data ={
                place : value.division, 
                events: value.events
            }
            listOfHolidays.push(data)
        })
        return listOfHolidays
    }

    onChange = (date) =>{
        let formattedDate = moment(date).format('YYYY-MM-DD')
        let listOfHolidays = this.state.listOfHolidays
        let list = []
        _.map(listOfHolidays, (item) =>{
            let events = _.filter(item.events,{ "date" :formattedDate})
            let data ={
                place : item.place, 
                events: events
            }
            if(!_.isEmpty(events))
                list.push(data)
        })
        this.setState({
            listOfHolidays:list
        })
    }

    onSearchClear = async () =>{
        let list = await this.getFormatList()
        this.setState({
            listOfHolidays : list
        })
    }

    render(){
        return(
            <div style={{padding:'20px'}}>
                <div style={{ height:'70px', backgroundColor:'#2c698d', borderRadius:10, margin:'auto'}}>
                    <p style={{justifyContent:'center',margin:'auto',padding:'15px',textAlign: 'center',color:'white',fontSize: 24,fontWeight: 600}}>List of holidays</p>
                </div>
                <DatePicker onChange={this.onChange} onSearchClear={this.onSearchClear}/>
                <div style={{display: "grid", gridTemplateColumns: 'auto auto auto'}}>
                    {
                        _.map(this.state.listOfHolidays, (item) =>{
                            return(
                                <div style={{margin:10,borderRadius:10, boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px'}}>
                                    <p style={{fontWeight:'bold',textAlign:'center', fontSize:20}}>{_.capitalize(item.place)}</p>
                                    <div style={{}}>
                                    <div style={{display:'grid',gridTemplateColumns: 'auto auto', marginRight:'auto', placeItems:'center'}}>
                                    {
                                        _.map(item.events, event =>{
                                            console.log(event)
                                            return(
                                                <div style={{width:130, margin:'10px 0px',boxShadow:'0 4px 8px 0 rgba(0,0,0,0.2)',borderRadius:10,padding:5, background:'#e3f6f5' }}>
                                                    <p style={{margin:'auto', fontSize:20, fontWeight:'600', textAlign:'center'}}>{moment(event.date).format('DD MMM')}</p>
                                                    <p style={{color:'grey',margin:'auto',textAlign:'center', fontSize:13, fontWeight:'bold'}}>{moment(event.date).format('YYYY')}</p>
                                                    <p style={{margin:'auto', fontSize:15, textAlign:'center'}}>{event.title}</p>
                                                    <p style={{margin:'auto', fontSize: 10,textAlign:'center', color:'grey'}}>{event.notes}</p>
                                                </div>
                                            )
                                        })
                                    }
                                    </div>
                                    </div>
                                    <div>

                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        ) 
    }
}

export default HomePage;