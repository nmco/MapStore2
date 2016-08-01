/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const {Button, Glyphicon} = require('react-bootstrap');

const RulesTableControls = React.createClass({
    propTypes: {
        updateActiveRule: React.PropTypes.func,
        deleteRules: React.PropTypes.func,
        selectedRules: React.PropTypes.array
    },
    getDefaultProps() {
        return {
            updateActiveRule: () => {},
            deleteRules: () => {},
            selectedRules: []
        };
    },
    getAddRuleHandler() {
        return function() {
            this.props.updateActiveRule({}, "new", false);
        }.bind(this);
    },
    getEditRuleHandler() {
        return function() {
            this.props.updateActiveRule(this.props.selectedRules[0], "edit", false);
        }.bind(this);
    },
    render() {
        return (
            <div className="rules-table-controls">
                <Button bsSize="small" bsStyle="primary" onClick={this.getAddRuleHandler()}>
                    <Glyphicon glyph="plus"/>
                </Button>
                { this.props.selectedRules.length > 0 &&
                    <Button bsSize="small" bsStyle="primary" onClick={this.props.deleteRules}>
                        <Glyphicon glyph="minus"/>
                    </Button>
                }
                { this.props.selectedRules.length === 1 &&
                    <Button bsSize="small" bsStyle="primary" onClick={this.getEditRuleHandler()}>
                        <Glyphicon glyph="pencil"/>
                    </Button>
                }
            </div>
        );
    }
});

module.exports = RulesTableControls;
