###
Copyright 2016 Kinvey, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
###

# Package modules.
async   = require 'async'
program = require 'commander'

# Local modules.
service = require '../lib/service.coffee'
init     = require '../lib/init.coffee'
logger   = require '../lib/logger.coffee'
project  = require '../lib/project.coffee'
user     = require '../lib/user.coffee'

# Entry point for the status command.
module.exports = status = (job, command, cb) ->
  options = init command # Initialize the command.

  async.series [
    # Set-up user and restore project.
    (next) -> user.setup options, next
    project.restore

    # Retrieve the job status.
    (next) -> service.jobStatus job, next
  ], (err) ->
    if err? # Display errors.
      logger.error '%s', err
      unless cb? then process.exit -1 # Exit with error.
    cb? err

# Register the command.
program
  .command     'job [id]'
  .description 'return the job status of a deploy command'
  .action      status