const sinon = require('sinon');

const { Account } = require('../../models');
const loginHandler = require('./');

let req = {
    body: { email: 'test@example.com', password: '123456' },
    session: { userId: '1234' },
    app: { locals: { baseUrl: '/' } }
  },
  res = {},
  next = sinon.spy(),
  template = 'login',
  mockAccount = [{ validated: false }],
  errors = [{ msg: 'Account email not validated.' }];

describe('loginHandler middleware', () => {
  beforeEach(() => {
    res = {
      redirect: sinon.spy(),
      render: sinon.spy()
    };
    sinon
      .stub(Account, 'find')
      .returns({ exec: callBack => callBack(null, mockAccount) });
  });
  afterEach(() => {
    Account.find.restore();
  });

  it('should render login page with error, if account not validated', done => {
    loginHandler(req, res, next, template);
    Account.findByEmail(req.body.email).then(() => {
      sinon.assert.calledWith(res.render, template, {
        account: req.body,
        errors
      });
      done();
    });
  });

  it('should render account page, if password validated', done => {
    // findByEmail mock set up
    mockAccount[0].validated = true;
    // validatePassword mock set up
    sinon.stub(Account, 'validatePassword').resolves('someid');

    loginHandler(req, res, next, template);
    Account.findByEmail(req.body.email).then(() => {
      Account.validatePassword()
        .then(() => {
          sinon.assert.calledWith(res.redirect, '/account');
          done();
          Account.validatePassword.restore();
        })
        .catch(done);
    });
  });

  it('should render error page, on database API error', done => {
    // validatePassword mock set up
    sinon.stub(Account, 'validatePassword').rejects({ status: 500 });

    loginHandler(req, res, next, template);
    Account.findByEmail(req.body.email).then(() => {
      Account.validatePassword()
        .then(() => done('It should not resolved!'))
        .catch(err => {
          sinon.assert.calledWith(next, err);
          done();
          Account.validatePassword.restore();
        });
    });
  });

  it('should render login page, with password related error', done => {
    // validatePassword mock set up
    sinon.stub(Account, 'validatePassword').rejects(errors);

    loginHandler(req, res, next, template);
    Account.findByEmail(req.body.email).then(() => {
      Account.validatePassword()
        .then(() => done('It should not resolved!'))
        .catch(err => {
          sinon.assert.calledWith(res.render, template, {
            account: req.body,
            errors: [{ msg: errors }]
          });
          done();
          Account.validatePassword.restore();
        });
    });
  });

  it('should render error page on database API error', done => {
    Account.find.restore();
    sinon
      .stub(Account, 'find')
      .returns({ exec: callBack => callBack({ status: 500 }) });

    loginHandler(req, res, next, template);

    Account.findByEmail(req.body.email)
      .then(() => done('It should catch error!'))
      .catch(err => {
        sinon.assert.calledWith(next, err);
        done();
      });
  });

  it('should render login page, with account related error', done => {
    Account.find.restore();
    sinon.stub(Account, 'find').returns({ exec: callBack => callBack(errors) });

    loginHandler(req, res, next, template);
    Account.findByEmail(req.body.email)
      .then(() => done('It should give errro!'))
      .catch(errors => {
        sinon.assert.calledWith(res.render, template, {
          account: req.body,
          errors: [{ msg: errors }]
        });
        done();
      });
  });
});
