import Post from './api/post.js';
import {PasswordHash} from 'phpass';

export default class extends Post {
  modelInstance = this.model('post');

  async __before() {

  }

  async checkAuth(data) {
    let {app_key, auth_key, ...post} = data;
    //check user
    let poster = await this.model('user').where({app_key}).find();
    if( think.isEmpty(poster) ) {
      return this.fail('POSTER_NOT_EXIST');
    }

    this.poster = poster;
    let {app_secret} = poster;
    let passwordHash = new PasswordHash();
    let result = passwordHash.checkPassword(`${app_secret}${post.markdown_content}`, auth_key);
    return result;
  }

  async updatePost(post) {
    if( post.markdown_content ) { post = this.getContentAndSummary(post); }
    if( post.create_time ) { post = this.getPostTime(post); }
    if( post.tag ) { post = await this.getTagIds(post.tag); }
    let rows = await this.modelInstance.savePost(post);
    return this.success({affectedRows: rows});
  }

  async getAction() {
    if( !this.get('app_key') || !this.get('auth_key') ) {
      return this.fail('PARAMS_ERROR');
    }

    let {app_key, auth_key} = this.get();
    let result = await this.checkAuth({app_key, auth_key, markdown_content: 'Firekylin'});
    return result ? this.success('KEY_CHECK_SUCCESS') : this.fail('KEY_CHECK_FAILED');
  }

  async postAction() {
    let post = this.post();
    if( !this.checkAuth(post) ) { return this.fail('POST_CONTENT_ERROR'); }

    //check pathname
    let exPost = await this.modelInstance.where({pathname: post.pathname}).find();
    if( !think.isEmpty(exPost) ) {
      if( exPost.user.id != this.poster.id ) {
        return this.fail('POST_USER_ERROR');
      }
      post.id = exPost.id;
      return this.updatePost(post);
    }
    
    post.user_id = this.poster.id;
    post = this.getContentAndSummary(post);
    post = this.getPostTime(post);
    post.tag = await this.getTagIds(post.tag);

    if( post.status == 3 && this.poster.type != 1 ) {
      post.status = 1;
    }

    let insertId = await this.modelInstance.addPost(post);
    return this.success({id: insertId});
  }

  async putAction() {
  }

  async deleteAction() {
  }
}
