import Reflux from 'reflux';


let AsyncConfig = {asyncResult: true};
export default Reflux.createActions({
  select: {children: ['completed', 'failed']},
  delete: {children: ['completed', 'failed']},
  pass: {children: ['completed', 'failed']},
  save: {children: ['completed', 'failed'], asyncResult: true},
  savepwd: {children: ['completed', 'failed'], asyncResult: true},
  login: {children: ['completed', 'failed'], asyncResult: true},
  generateKey: {children: ['completed', 'failed'], asyncResult: true}
});
