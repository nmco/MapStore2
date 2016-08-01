/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const {Panel} = require('react-bootstrap');
const _ = require('lodash');
const Select = require('./Select');

const ACCESS_TYPES = [
    'ALLOW',
    'DENY'
];

const RuleAttributes = React.createClass({
    propTypes: {
        loadRoles: React.PropTypes.func,
        loadUsers: React.PropTypes.func,
        loadWorkspaces: React.PropTypes.func,
        loadLayers: React.PropTypes.func,
        panelHeader: React.PropTypes.string,
        options: React.PropTypes.object,
        services: React.PropTypes.object,
        updateRuleAttributes: React.PropTypes.func,
        ruleAttributes: React.PropTypes.object,
        showAccess: React.PropTypes.bool,
        containerClassName: React.PropTypes.string,
        selectClassName: React.PropTypes.string
    },
    contextTypes: {
        messages: React.PropTypes.object
    },
    getDefaultProps() {
        return {
            loadRoles: () => {},
            loadUsers: () => {},
            loadWorkspaces: () => {},
            loadLayers: () => {},
            options: {},
            updateRuleAttributes: () => {},
            ruleAttributes: {},
            showAccess: false
        };
    },
    getServicesNames() {
        return Object.keys(this.props.services);
    },
    getRequestsNames() {
        if (this.props.ruleAttributes.service) {
            return this.props.services[this.props.ruleAttributes.service];
        }
        return _(Object.values(this.props.services)).flatten().uniq().value();
    },
    render() {
        const requestNames = this.getRequestsNames() || [];
        const requestFilterValue = this.filterValue(this.props.ruleAttributes.request, requestNames);
        return (
            <Panel header={this.props.panelHeader} className={this.props.containerClassName}>
                <Select
                    loadOptions={this.props.loadRoles}
                    onValueUpdated={this.createUpdateFunction('roleName')}
                    selectedValue={this.props.ruleAttributes.roleName}
                    placeholderMsgId={'rulesmanager.role'}
                    options={this.props.options.roles}
                    className={this.props.selectClassName}/>
                <Select
                    loadOptions={this.props.loadUsers}
                    onValueUpdated={this.createUpdateFunction('userName')}
                    selectedValue={this.props.ruleAttributes.userName}
                    placeholderMsgId={'rulesmanager.user'}
                    options={this.props.options.users}
                    className={this.props.selectClassName}/>
                <Select
                    onValueUpdated={this.createUpdateFunction('service', 'request')}
                    selectedValue={this.props.ruleAttributes.service}
                    placeholderMsgId={'rulesmanager.service'}
                    options={this.getServicesNames()}
                    className={this.props.selectClassName}/>
                <Select
                    onValueUpdated={this.createUpdateFunction('request')}
                    selectedValue={requestFilterValue}
                    placeholderMsgId={'rulesmanager.request'}
                    options={requestNames}
                    className={this.props.selectClassName}
                    disabled={this.isNullValue(this.props.ruleAttributes.service)}/>
                <Select loadOptions={this.props.loadWorkspaces}
                    onValueUpdated={this.createUpdateFunction('workspace', 'layer')}
                    selectedValue={this.props.ruleAttributes.workspace}
                    placeholderMsgId={'rulesmanager.workspace'}
                    options={this.props.options.workspaces}
                    className={this.props.selectClassName}/>
                <Select loadOptions={this.props.loadLayers}
                    onInputChange={this.props.loadLayers}
                    onValueUpdated={this.createUpdateFunction('layer')}
                    selectedValue={this.props.ruleAttributes.layer}
                    placeholderMsgId={'rulesmanager.layer'}
                    options={this.props.options.layers}
                    className={this.props.selectClassName}
                    disabled={this.isNullValue(this.props.ruleAttributes.workspace)}/>
                {
                    this.props.showAccess &&
                    <Select onValueUpdated={this.createUpdateFunction('access')}
                        selectedValue={this.props.ruleAttributes.access}
                        placeholderMsgId={'rulesmanager.access'}
                        options={ACCESS_TYPES}
                        className={this.props.selectClassName}/>
                }
            </Panel>
        );
    },
    filterValue(value, values) {
        if (value && values.find(existing => existing === value)) {
            return value;
        }
        return undefined;
    },
    createUpdateFunction(attributeName, attributeNameToReset) {
        return function(attributeValue) {
            if (attributeNameToReset) {
                this.props.updateRuleAttributes(
                    {[attributeName]: attributeValue ? attributeValue.value : "*"});
            } else {
                this.props.updateRuleAttributes(
                    {[attributeName]: attributeValue ? attributeValue.value : "*"},
                    {[attributeNameToReset]: undefined});
            }
        }.bind(this);
    },
    isNullValue(value) {
        return value === undefined || value === "*";
    }
});

module.exports = RuleAttributes;
