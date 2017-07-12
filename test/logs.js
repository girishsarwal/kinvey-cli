/**
 * Copyright (c) 2017, Kinvey, Inc. All rights reserved.
 *
 * This software is licensed to you under the Kinvey terms of service located at
 * http://www.kinvey.com/terms-of-use. By downloading, accessing and/or using this
 * software, you hereby accept such terms of service  (and any agreement referenced
 * therein) and agree that you have read, understand and agree to be bound by such
 * terms of service and are of legal age to agree to such terms with Kinvey.
 *
 * This software contains valuable confidential and proprietary information of
 * KINVEY, INC and is subject to applicable licensing agreements.
 * Unauthorized reproduction, transmission or distribution of this file and its
 * contents is a violation of applicable laws.
 */

const sinon = require('sinon');
const command = require('./fixtures/command.js');
const service = require('../lib/service.js');
const logs = require('../cmd/logs.js');
const pkg = require('../package.json');
const project = require('../lib/project.js');
const user = require('../lib/user.js');

describe(`./${pkg.name} logs`, () => {
  before('user', () => {
    sinon.stub(user, 'setup').callsArg(1);
  });
  afterEach('user', () => {
    user.setup.reset();
  });
  after('user', () => {
    user.setup.restore();
  });

  before('project', () => {
    sinon.stub(project, 'restore').callsArg(0);
  });
  afterEach('project', () => {
    project.restore.reset();
  });
  after('project', () => {
    project.restore.restore();
  });

  before('logs', () => {
    sinon.stub(service, 'logs').callsArg(2);
  });
  afterEach('logs', () => {
    service.logs.reset();
  });
  after('logs', () => {
    service.logs.restore();
  });

  it('should setup the user.', (cb) => {
    logs(null, null, command, (err) => {
      expect(user.setup).to.be.calledOnce;
      cb(err);
    });
  });
  it('should restore the project.', (cb) => {
    logs(null, null, command, (err) => {
      expect(project.restore).to.be.calledOnce;
      cb(err);
    });
  });
  it('should retrieve log entries based on query', (cb) => {
    logs(null, null, command, (err) => {
      expect(service.logs).to.be.calledOnce;
      cb(err);
    });
  });
  it('should fail with an invalid \'from\' timestamp', (done) => {
    logs('abc', null, command, (err) => {
      expect(err).to.exist;
      expect(err.message).to.equal("Logs \'from\' timestamp invalid (ISO-8601 required)");
      done();
    });
  });
  it('should fail with an invalid \'to\' timestamp', (done) => {
    logs(null, 'abc', command, (err) => {
      expect(err).to.exist;
      expect(err.message).to.equal("Logs \'to\' timestamp invalid (ISO-8601 required)");
      done();
    });
  });
});