/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const {Panel} = require('react-bootstrap');

const RulesTable = require('./RulesTable');
const RulesTablePagination = require('./RulesTablePagination');
const RulesTableControls = require('./RulesTableControls');
const LocaleUtils = require('../../../utils/LocaleUtils');

const RulesTablePanel = React.createClass({
    propTypes: {
        onSelectRules: React.PropTypes.func,
        moveRules: React.PropTypes.func,
        loadRules: React.PropTypes.func,
        deleteRules: React.PropTypes.func,
        rules: React.PropTypes.array,
        rulesPage: React.PropTypes.number,
        rulesCount: React.PropTypes.number,
        selectedRules: React.PropTypes.array,
        updateActiveRule: React.PropTypes.func
    },
    contextTypes: {
        messages: React.PropTypes.object
    },
    getDefaultProps() {
        return {
            loadRules: () => {}
        };
    },
    componentDidMount() {
        this.props.loadRules(1);
    },
    render() {
        return (
            <Panel header={this.locale("rules")}>
                <RulesTableControls
                    deleteRules={this.props.deleteRules}
                    selectedRules={this.props.selectedRules}
                    updateActiveRule={this.props.updateActiveRule}
                    />
                <RulesTable
                    onSelectRules={this.props.onSelectRules}
                    rules={this.props.rules}
                    selectedRules={this.props.selectedRules}
                    moveRules={this.props.moveRules}/>
                <RulesTablePagination
                    loadRules={this.props.loadRules}
                    rulesPage={this.props.rulesPage}
                    rulesCount={this.props.rulesCount}/>
            </Panel>
        );
    },
    locale(messageId) {
        return LocaleUtils.getMessageById(
            this.context.messages, "rulesmanagers." + messageId);
    }
});

module.exports = RulesTablePanel;
