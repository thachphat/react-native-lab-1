/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry
} from 'react-native';

import Post from './apps/posts.js'

export default class ReactNativeCoderSchoolLab1 extends Component {
  render() {
    return (
      <Post />
    );
  }
}

AppRegistry.registerComponent('ReactNativeCoderSchoolLab1', () => ReactNativeCoderSchoolLab1);
