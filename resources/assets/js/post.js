import React, { Component } from 'react';
import {Button,ButtonGroup,Dropdown} from 'react-bootstrap';
import './css/post.css';
import Icon from './components/icon';

const NCKU=
["中文系","外文系","台文系",
"數學系","物理系","化學系","地科系","光電系",
"機械系","化工系","材料系","資源系","土木系","水利系","工科系","系統系","航太系","環工系","測量系","醫工系","能源學程",
"工資系","交管系","企管系","統計系","會計系"
,"醫學系","醫技系","護理系","職治系","物治系","藥學系",
"政治系","經濟系","法律系","心理系",
"電機系","資訊系",
"建築系","都計系","工設系",
"生科系","生技系"];


class post extends Component {
    constructor(props) {
    super(props)
    this.state = {
        type: "轉系",
        year: "",
        score: 0,
        out_maj: "",
        in_maj: "",
        comment: "",
        is_send: false,
    }
    this.handleClick = this.handleClick.bind(this)
    this.changeType = this.changeType.bind(this)
    this.changeYear = this.changeYear.bind(this)
    this.changeOut = this.changeOut.bind(this)
    this.changeScore=this.changeScore.bind(this)
    this.changeIn = this.changeIn.bind(this)
    this.changeComment = this.changeComment.bind(this)
  }
  handleClick() {
    const data={
        'trans_type':this.state.type,
        'year':this.state.year,
        'score':this.state.score,
        'in_maj':this.state.in_maj,
        'out_maj':this.state.out_maj,
        'comment':this.state.comment,
    };
    fetch(
      '/api/create/major', {method: 'POST',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json'
          })
        }
    )
      .then(res => res.json())
      .catch(e => console.log('錯誤:', e))
    this.setState({is_send:true})
  }


    changeType(e){
        this.setState({type: e.target.value});
    }

    changeYear(e){
        this.setState({year: e.target.value});
    }

    changeScore(e){
      this.setState({score: e.target.value});
  }

    changeOut(e){
        this.setState({out_maj: e.target.value});
    }

    changeIn(e){
        this.setState({in_maj: e.target.value});
    }

    changeComment(e){
        this.setState({comment: e.target.value});
    }

  render() {
    const maj_option=NCKU.map(department=>{return(
      <option value={department} style={{textAlign:"center"}}>{department}</option>
    );});

    const display=(this.state.is_send===true)?<span>感謝你的填寫!<br/>審查通過後就會看到你的心得囉!</span>:
    <div className="form_container" style={{position:"absolute",color:"rgb(229,68,109)",boxShadow:"0 0px 12px rgba(0,0,0,.175)",maxWidth:"90%"}}>
    <h1 style={{width:"100%",textAlign:"left"}}>分享你的心得吧!</h1>
    <p>
      轉系/轉學:<br/>   
      <select id="trans_type" name ="trans_type" onChange={this.changeType} style={{color:"black"}}>
        <option value="轉系">轉系</option>
        <option value="轉學">轉學</option>
      </select>
    </p>
    <p >
     
    申請年度:<br/><input id="year" type="text" onChange={this.changeYear}/>
    </p>
    <p >
    <br/>    
    學年分數:<br/><input id="score" type="text" onChange={this.changeScore}/>
    </p>
    <p>
    <br/>    
    轉出科系:<br/>
    <select id="out_maj"  onChange={this.changeOut} style={{color:"black"}}>
        {maj_option}
      </select>
    </p>
    <p >
    <br/>
    轉入科系:<br/><select id="in_maj"  onChange={this.changeIn} style={{color:"black"}}>
        {maj_option}
      </select>    
    </p>
    心得:<br/>   
    <textarea id="comment" placeholder="" onChange={this.changeComment} ></textarea>
    <button onClick={this.handleClick} style={{marginLeft: "10%",marginRight: "10%",width:"80%",borderRadius:"0",border:"0px solid rgb(229,68,109)",color:"white",backgroundColor:"rgb(229,68,109)"}}>送出</button>
    </div>
    ;

    return (
      <div className="post">
                <nav><a>聯絡我們</a><a href="/#/post">分享心得</a><a>常見QA</a><a href="/#/comment">瀏覽心得</a></nav>
        <div className="index">
          {display}
        </div>
      </div>
    );
  }
}

export default post;
