import React from 'react';
import ReactDom from 'react-dom';
import Base from 'base';
import {Link} from 'react-router';
import classnames from 'classnames';

import { Radio, RadioGroup, Form, ValidatedInput  } from 'react-bootstrap-validation';
import md5 from 'md5';

import BreadCrumb from 'admin/component/breadcrumb';

import OptionsAction from '../action/options';
import OptionsStore from '../store/options';
import TipAction from 'common/action/tip';
import ModalAction from 'common/action/modal';

export default class extends Base {
  constructor(props){
    super(props);
    let comment = SysConfig.options.comment;
    if(typeof comment === 'string'){
      comment = JSON.parse(comment);
    }
    comment.name = unescape(comment.name);
    this.state = {
      submitting: false,
      comment: comment
    };
    this.commentType = comment.type;
  }
  componentDidMount(){
    this.listenTo(OptionsStore, this.handleTrigger.bind(this));
  }
  handleTrigger(data, type){
    switch(type){
      case 'saveCommentSuccess':
        this.setState({submitting: false});
        TipAction.success('评论设置更新成功');
        let comment = JSON.parse(SysConfig.options.comment);
        SysConfig.options.comment = JSON.stringify({
          "comment": comment
        });
        break;
    }
  }
  handleValidSubmit(values){
    this.setState({submitting: true});
    this.optionsSavedValue = values;
    OptionsAction.comment(values);
  }
  getProps(name){
    let props = {
      value: this.state.comment[name] || '',
      onChange: this.changeInput.bind(this, name)
    };
    return props;
  }
  changeInput(type, event){
    let value = event.target.value;
    let comment = this.state.comment;
    comment[type] = value;
    this.setState({comment: comment});
  }

  openDialog(){
    let url = "/static/img/duoshuo.jpg";
    if(this.commentType === 'disqus'){
      url = "/static/img/disqus.jpg";
    }
    let content = (<div className="center">
      <a href={url} target="_blank"><img src={url} style={{maxWidth: '100%'}} /></a>
    </div>);
    let instance = ModalAction.alert('提示', content);
  }
  render(){
    let comment = this.state.comment;
    let res = (
      <RadioGroup
          name='type'
          value={comment.type}
          validate={(value) => {
            this.commentType = value;
            this.forceUpdate();
            return true;
          }}
      >
        <Radio value='disqus' label='Disqus' />
        <Radio value='duoshuo' label='多说' />
        <Radio value='custom' label='自定义' />
      </RadioGroup>
    );

    return (
      <div className="fk-content-wrap">
        <BreadCrumb {...this.props} />
        <div className="manage-container">
        <Form onValidSubmit={this.handleValidSubmit.bind(this)} className="clearfix options-comment">
          <div className="form-group">
            <label>评论类型</label>
            { res }
          </div>

          {this.commentType != 'custom' ?
          <div className="form-group">
            <label>网站名称（<a onClick={this.openDialog.bind(this)}>有疑问</a>）</label>
            <ValidatedInput
                type='text'
                {...this.getProps('name')}
                validate="required"
                errorHelp={{
                    required: '请填写在评论服务里的网站名称'
                }}
                name='name'
              />
          </div>
          :
          <ValidatedInput
              type="textarea"
              name="name"
              {...this.getProps('name')}
              validate="required"
              errorHelp="请填写评论代码"
              label="评论代码"
              style={{height: 240}}
          />}
          <button type="submit" className="btn btn-primary" style={{ margin: '20px 0 0 10px' }}>{ this.state.submitting ? '提交中...' : '提交'  }</button>
        </Form>
      </div>
    </div>
    );
  }
}
