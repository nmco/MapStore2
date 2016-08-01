/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const RuleAttributes = require('./RuleAttributes');
const LocaleUtils = require('../../../utils/LocaleUtils');

const RulesFiltersPanel = React.createClass({
    propTypes: {
        loadRoles: React.PropTypes.func,
        loadUsers: React.PropTypes.func,
        loadWorkspaces: React.PropTypes.func,
        loadLayers: React.PropTypes.func,
        services: React.PropTypes.object,
        options: React.PropTypes.object,
        updateFiltersValues: React.PropTypes.func,
        filtersValues: React.PropTypes.object,
        loadRules: React.PropTypes.func
    },
    contextTypes: {
        messages: React.PropTypes.object
    },
    getDefaultProps() {
        return {
            loadRules: () => {}
        };
    },
    componentWillReceiveProps(newProps) {
        const newFiltersValues = newProps.filtersValues || {};
        const currentFiltersValues = this.props.filtersValues || {};
        if (newFiltersValues.roleName !== currentFiltersValues.roleName
            || newFiltersValues.userName !== currentFiltersValues.userName
            || newFiltersValues.service !== currentFiltersValues.service
            || newFiltersValues.request !== currentFiltersValues.request
            || newFiltersValues.workspace !== currentFiltersValues.workspace
            || newFiltersValues.layer !== currentFiltersValues.layer) {
            this.props.loadRules(0);
        }
    },
    getUpdateFiltersValuesHandler() {
        return function(updatedFiltersValues) {
            this.props.updateFiltersValues(updatedFiltersValues, true);
        }.bind(this);
    },
    render() {
        const panelHeader = LocaleUtils.getMessageById(this.context.messages, 'rulesmanager.filters');
        return (
            <RuleAttributes
                panelHeader={panelHeader}
                loadRoles={this.props.loadRoles}
                loadUsers={this.props.loadUsers}
                loadWorkspaces={this.props.loadWorkspaces}
                loadLayers={this.props.loadLayers}
                services={this.props.services}
                options={this.props.options}
                updateRuleAttributes={this.getUpdateFiltersValuesHandler()}
                ruleAttributes={this.props.filtersValues}
                containerClassName="filters-container"
                selectClassName="col-md-2"/>
        );
    }
});

module.exports = RulesFiltersPanel;
