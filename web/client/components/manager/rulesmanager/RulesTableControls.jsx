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
        moveRulesToPage: React.PropTypes.func,
        updateActiveRule: React.PropTypes.func,
        deleteRules: React.PropTypes.func,
        selectedRules: React.PropTypes.array,
        rulesPage: React.PropTypes.number,
        rulesCount: React.PropTypes.number
    },
    getDefaultProps() {
        return {
            moveRulesToPage: () => {},
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
        const numberOfPages = Math.ceil(this.props.rulesCount / 10);
        const firstPage = this.props.rulesPage === 1 || !this.props.rulesPage;
        const lastPage = this.props.rulesPage === numberOfPages || !this.props.rulesPage;
        return (
            <div className="rules-controls">
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
                { this.props.selectedRules.length > 0 && !firstPage &&
                    <Button bsSize="small" bsStyle="primary"
                        onClick={() => this.props.moveRulesToPage(1, false, this.props.selectedRules)}>
                        <Glyphicon glyph="fast-backward"/>
                    </Button>
                }
                { this.props.selectedRules.length > 0 && !firstPage &&
                    <Button bsSize="small" bsStyle="primary"
                        onClick={() => this.props.moveRulesToPage(this.props.rulesPage - 1, false, this.props.selectedRules)}>
                        <Glyphicon glyph="step-backward"/>
                    </Button>
                }
                { this.props.selectedRules.length > 0 && !lastPage &&
                    <Button bsSize="small" bsStyle="primary"
                        onClick={() => this.props.moveRulesToPage(this.props.rulesPage + 1, true, this.props.selectedRules)}>
                        <Glyphicon glyph="step-forward"/>
                    </Button>
                }
                { this.props.selectedRules.length > 0 && !lastPage &&
                    <Button bsSize="small" bsStyle="primary"
                        onClick={() => this.props.moveRulesToPage(numberOfPages, true, this.props.selectedRules)}>
                        <Glyphicon glyph="fast-forward"/>
                    </Button>
                }
            </div>
        );
    }
});

module.exports = RulesTableControls;
