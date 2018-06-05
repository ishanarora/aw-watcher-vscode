//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';
import AWClient from '../resources/aw-client.js';
import ProjectEvent from '../resources/event';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// import * as vscode from 'vscode';
// import * as myExtension from '../extension';

// Defines a Mocha test suite to group tests of similar kind together
describe("AWClient", function () {
    const client = new AWClient();

    beforeEach(function initBucket (done) {
        client.initBucket('aw-watcher-coding-test', 'mocha', 'coding.editor.project')
            .then(() => done())
            .catch(err => {
                done(new Error(err));
            });
    });

    describe("bucket", () => {
        it('[initBucket] should create aw-watcher-coding-test bucket without error', function (done) {
            client.initBucket('aw-watcher-coding-test', 'test', 'coding.editor.project')
                .then(() => done())
                .catch(err => {
                    done(new Error(err));
                });
        });
        it('[getBucket] should retrieve bucket information for aw-watcher-coding-test', function (done) {
            client.getBucket()
                .then(({ data }) => {
                    assert.equal('aw-watcher-coding-test', data.client);
                    done();
                })
                .catch(err => done(new Error(err)));
        });
        it('[deleteBucket] should delete bucket without error', function (done) {
            client.deleteBucket()
                .then(() => client.getBucket())
                .then(() => done(new Error('got bucket information after deletion')))
                .catch(({ err, httpResponse, data }) => {
                    assert.equal(httpResponse.statusCode, 404);
                    done();
                });
        });
    });

    describe('events', () => {
        it('[sendEvent] should send event without errors', function (done) {
            const event = new ProjectEvent({
                timestamp: new Date(),
                duration: 2,
                data: {
                    editor: 'vs-code',
                    project: 'aw-extension',
                    language: 'ts'
                }
            });

            client.sendEvent(event)
                .then(({ httpResponse, data }) => {
                    done();
                })
                .catch(({ err, httpResponse }) => {
                    done(new Error(err));
                });
        });
        it('[getEvents] should get previously created event', function (done) {
            client.getEvents()
                .then(({ httpResponse, data }) => {
                    done();
                })
                .catch(({ err, httpResponse }) => {
                    done(new Error(err));
                });
        });
    });

    describe('heartbeat', () => {
        it('[sendHeartbeat] should send heartbeat without errors', function (done) {
            const event = new ProjectEvent({
                timestamp: new Date(),
                duration: 2,
                data: {
                    editor: 'vs-code',
                    project: 'aw-extension',
                    language: 'ts'
                }
            });

            client.sendHearbeat(event, 10)
                .then(() => done())
                .catch(({ err }) => done(new Error(err)));
        });
    });
});