/**
 * External dependencies
 */
import EntitiesSearch from '@types';

import { describe, expect, it } from '@jest/globals';

import { faker } from '@faker-js/faker';

/**
 * Internal dependencies
 */
import { reducer } from '../../../../sources/client/src/storage/entities/reducer';
import { Set } from '../../../../sources/client/src/vo/set';

let state: EntitiesSearch.EntitiesState< number, string >;

describe( 'reducer', () => {
	it( 'Update the Entities', () => {
		const entities = new Set< number >();
		const newState = reducer( state, {
			type: 'UPDATE_ENTITIES',
			entities,
		} );

		expect( newState.entities ).toEqual( entities );
	} );

	it( 'Update the Kind', () => {
		const kind = new Set( [ 'post' ] );
		const newState = reducer( state, {
			type: 'UPDATE_KIND',
			kind,
		} );

		expect( newState.kind ).toEqual( kind );
	} );

	it( 'Update the Contextual Posts Options', () => {
		const contextualPostsOptions = new Set( [
			{
				value: faker.number.int( 10 ),
				label: 'Post One',
			},
			{
				value: faker.number.int( { min: 11, max: 20 } ),
				label: 'Post Two',
			},
		] );
		const newState = reducer( state, {
			type: 'UPDATE_CONTEXTUAL_ENTITIES_OPTIONS',
			contextualEntitiesOptions: contextualPostsOptions,
		} );

		expect( newState.contextualEntitiesOptions ).toEqual(
			contextualPostsOptions
		);
	} );

	it( 'Update the Posts Options', () => {
		const postsOptions = new Set( [
			{
				value: faker.number.int( 10 ),
				label: 'Post Two',
			},
			{
				value: faker.number.int( { min: 11, max: 20 } ),
				label: 'Post Three',
			},
		] );
		const newState = reducer( state, {
			type: 'UPDATE_CURRENT_ENTITIES_OPTIONS',
			currentEntitiesOptions: postsOptions,
		} );

		expect( newState.currentEntitiesOptions ).toEqual( postsOptions );
	} );

	it( 'Update the Selected Posts Options with Control Options', () => {
		const posts = new Set( [
			{
				value: 55,
				label: 'Post FiftyFive',
			},
			{
				value: 10,
				label: 'Post Ten',
			},
		] );
		const newState = reducer( state, {
			type: 'UPDATE_SELECTED_ENTITIES_OPTIONS',
			selectedEntitiesOptions: posts,
		} );

		expect( newState.selectedEntitiesOptions ).toEqual( posts );
	} );

	it( 'does nothing if the action type is not recognized', () => {
		const newState = reducer( state, {
			// @ts-ignore
			type: 'NOT_RECOGNIZED_ACTION',
		} );

		expect( newState ).toEqual( state );
	} );

	it( 'update search phrase', () => {
		const searchPhrase = faker.lorem.word();
		const newState = reducer( state, {
			type: 'UPDATE_SEARCH_PHRASE',
			searchPhrase,
		} );

		expect( newState.searchPhrase ).toEqual( searchPhrase );
	} );

	it( 'clean entities options', () => {
		const newState = reducer( state, {
			type: 'CLEAN_ENTITIES_OPTIONS',
		} );

		expect( newState.selectedEntitiesOptions ).toEqual( new Set() );
		expect( newState.contextualEntitiesOptions ).toEqual( new Set() );
		expect( newState.currentEntitiesOptions ).toEqual( new Set() );
	} );

	it( 'update entities options for new kind', () => {
		const kind = new Set( [ 'post' ] );
		const entitiesOptions = new Set( [
			{
				value: faker.number.int( 10 ),
				label: 'Post One',
			},
			{
				value: faker.number.int( { min: 11, max: 20 } ),
				label: 'Post Two',
			},
		] );
		const newState = reducer( state, {
			type: 'UPDATE_ENTITIES_OPTIONS_FOR_NEW_KIND',
			kind,
			entitiesOptions,
		} );

		expect( newState.contextualEntitiesOptions ).toEqual( entitiesOptions );
		expect( newState.currentEntitiesOptions ).toEqual( entitiesOptions );
		expect( newState.selectedEntitiesOptions ).toEqual( new Set() );
		expect( newState.entities ).toEqual( new Set() );
		expect( newState.kind ).toEqual( kind );
	} );
} );
