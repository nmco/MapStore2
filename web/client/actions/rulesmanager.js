/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const GeoServerAPI = require('../api/GeoServerDAO');

const axios = require('../libs/ajax');
const CatalogAPI = require('../api/CSW');
const ConfigUtils = require('../utils/ConfigUtils');

const RULES_SELECTED = 'RULES_SELECTED';
const RULES_LOADED = 'RULES_LOADED';
const UPDATE_ACTIVE_RULE = 'UPDATE_ACTIVE_RULE';
const UPDATE_FILTERS_VALUES = 'UPDATE_FILTERS_VALUES';
const ACTION_ERROR = 'ACTION_ERROR';
const OPTIONS_LOADED = 'OPTIONS_LOADED';

function rulesSelected(rules, merge, unselect) {
    return {
        type: RULES_SELECTED,
        rules: rules,
        merge: merge,
        unselect: unselect
    };
}

function rulesLoaded(rules, count, page) {
    return {
        type: RULES_LOADED,
        rules: rules,
        count: count,
        page: page
    };
}

function updateActiveRule(rule, status, merge) {
    return {
        type: UPDATE_ACTIVE_RULE,
        rule: rule,
        status: status,
        merge: merge
    };
}

function actionError(error, context) {
    return {
        type: ACTION_ERROR,
        error: error,
        context: context
    };
}

function optionsLoaded(name, values) {
    return {
        type: OPTIONS_LOADED,
        name: name,
        values: values
    };
}

function updateFiltersValues(filtersValues, merge) {
    return {
        type: UPDATE_FILTERS_VALUES,
        filtersValues: filtersValues,
        merge: merge
    };
}

function loadRoles(context) {
    return (dispatch) => {
        GeoServerAPI.getGroups().then((result) => {
            dispatch(optionsLoaded('roles', result.roles));
        }).catch((error) => {
            dispatch(actionError(error, context));
        });
    };
}

function loadUsers(context) {
    return (dispatch) => {
        GeoServerAPI.getUsers().then((result) => {
            dispatch(optionsLoaded('users', result.users));
        }).catch((error) => {
            dispatch(actionError(error, context));
        });
    };
}

function loadWorkspaces(context) {
    return (dispatch) => {
        GeoServerAPI.getWorkspaces().then((result) => {
            dispatch(optionsLoaded('workspaces', result.workspaces.workspace));
        }).catch((error) => {
            dispatch(actionError(error, context));
        });
    };
}

function loadLayers(input, workspace, context) {
    return (dispatch) => {
        const catalogUrl = ConfigUtils.getDefaults().geoServerUrl + 'csw';
        CatalogAPI.workspaceSearch(catalogUrl, 1, 25, input, workspace).then((layers) => {
            dispatch(optionsLoaded('layers', layers));
        }).catch((error) => {
            dispatch(actionError(error, context));
        });
    };
}

function loadRules(page) {
    return (dispatch, getState) => {
        const state = getState().rulesmanager || {};
        const filtersValues = state.filtersValues || {};
        axios.all([GeoServerAPI.loadRules(page, filtersValues),
                   GeoServerAPI.getRulesCount(filtersValues)])
            .then(axios.spread((rules, count) => {
                dispatch(rulesLoaded(rules, count, page));
            })).catch(error => {
                dispatch(actionError(error, "table"));
            }
        );
    };
}

function moveRules(targetPriority, rules) {
    return (dispatch, getSate) => {
        GeoServerAPI.moveRules(targetPriority, rules).then(() => {
            const state = getSate().rulesmanager || {};
            dispatch(loadRules(state.rulesPage || 1));
        }).catch(error => {
            dispatch(actionError(error, "table"));
        });
    };
}

function deleteRules() {
    return (dispatch, getState) => {
        const state = getState().rulesmanager || {};
        const rules = state.selectedRules || [];
        const calls = rules.map(rule => GeoServerAPI.deleteRule(rule.id));
        axios.all(calls).then(() => {
            dispatch(loadRules(state.rulesPage || 1));
        }).catch(error => {
            dispatch(actionError(error, "table"));
        });
    };
}

function addRule() {
    return (dispatch, getState) => {
        const state = getState().rulesmanager || {};
        const activeRule = state && state.activeRule || {};
        const rulesPage = state.rulesPage || 1;
        GeoServerAPI.addRule(activeRule.rule).then(() => {
            dispatch(loadRules(rulesPage));
        }).catch((error) => {
            dispatch(actionError(error, "modal"));
        });
    };
}

function updateRule() {
    return (dispatch, getState) => {
        const state = getState().rulesmanager || {};
        const activeRule = state && state.activeRule || {};
        const rulesPage = state.rulesPage || 1;
        GeoServerAPI.updateRule(activeRule.rule).then(() => {
            dispatch(loadRules(rulesPage));
        }).catch((error) => {
            dispatch(actionError(error, "modal"));
        });
    };
}

module.exports = {
    RULES_SELECTED,
    RULES_LOADED,
    UPDATE_ACTIVE_RULE,
    UPDATE_FILTERS_VALUES,
    ACTION_ERROR,
    OPTIONS_LOADED,
    rulesLoaded,
    rulesSelected,
    loadRules,
    moveRules,
    updateActiveRule,
    updateFiltersValues,
    deleteRules,
    addRule,
    updateRule,
    loadRoles,
    loadUsers,
    loadWorkspaces,
    loadLayers
};
