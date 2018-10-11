/**
 * Copyright (c) 2018, Kinvey, Inc. All rights reserved.
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

const async = require('async');

const ConfigManagementHelper = require('./../../ConfigManagementHelper');

const EnvHelper = ConfigManagementHelper.env;
const AppHelper = ConfigManagementHelper.app;
const { execCmdWoMocks, randomStrings } = require('./../../TestsHelper');

module.exports = () => {
  const internalCollList = EnvHelper.buildValidInternalCollectionsList(2, false);
  const internalConfigColls = ConfigManagementHelper.common.buildConfigEntityFromList(internalCollList);
  const basicEnvWithInternalCollsOnly = {
    schemaVersion: '1.0.0',
    settings: EnvHelper.buildSettings(),
    collections: internalConfigColls
  };

  let appName;

  afterEach('remove app', (done) => {
    execCmdWoMocks(`app delete ${appName} --no-prompt`, null, done);
  });

  describe('in org', () => {
    it('settings and 2 envs (containing internal colls only) where one is the default should succeed', (done) => {
      const config = {
        schemaVersion: '1.0.0',
        configType: 'application',
        settings: {
          realtime: {
            enabled: true
          },
          sessionTimeoutInSeconds: 120
        },
        environments: {
          Prod: basicEnvWithInternalCollsOnly,
          Development: basicEnvWithInternalCollsOnly
        }
      };

      appName = randomStrings.appName();
      const orgIdentifier = 'CliOrg';
      let appId;

      async.series([
        (next) => {
          AppHelper.createFromConfig(appName, config, orgIdentifier, (err, id) => {
            if (err) {
              return next(err);
            }

            appId = id;
            next();
          });
        },
        (next) => {
          const options = {
            config,
            orgIdentifier,
            id: appId,
            expectedName: appName,
            collList: internalCollList,
            expectOrg: true
          };
          AppHelper.assertApp(options, next);
        }
      ], done);
    });
  });

  describe('outside org', () => {
    it('without envs should succeed', (done) => {
      const config = {
        schemaVersion: '1.0.0',
        configType: 'application',
        settings: {
          sessionTimeoutInSeconds: 120
        }
      };

      appName = randomStrings.appName();
      let appId;

      async.series([
        (next) => {
          AppHelper.createFromConfig(appName, config, null, (err, id) => {
            if (err) {
              return next(err);
            }

            appId = id;
            next();
          });
        },
        (next) => {
          const options = {
            config,
            id: appId,
            expectedName: appName
          };
          AppHelper.assertApp(options, next);
        }
      ], done);
    });

    it('2 envs (containing internal colls only) none of which is the default should succeed', (done) => {
      const config = {
        schemaVersion: '1.0.0',
        configType: 'application',
        environments: {
          Prod: basicEnvWithInternalCollsOnly,
          Test: basicEnvWithInternalCollsOnly
        }
      };

      appName = randomStrings.appName();
      let appId;

      async.series([
        (next) => {
          AppHelper.createFromConfig(appName, config, null, (err, id) => {
            if (err) {
              return next(err);
            }

            appId = id;
            next();
          });
        },
        (next) => {
          const options = {
            config,
            id: appId,
            expectedName: appName,
            collList: internalCollList
          };
          AppHelper.assertApp(options, next);
        }
      ], done);
    });
  });
};