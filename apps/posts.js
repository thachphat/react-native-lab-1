import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  RefreshControl,
  TouchableOpacity
} from 'react-native';

import Image from 'react-native-image-progress';
import Progress from 'react-native-progress';

export default class Post extends Component {
    ds;
    
    constructor() {
      super();
    ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.state = {
          data:[],
        dataSource: ds.cloneWithRows([]),
        refreshing: false,
        page: 0
      };
    }

    componentWillMount() {
        this.getMoviesFromApiAsync()
    }

    getMoviesFromApiAsync() {
        return fetch('https://api.tumblr.com/v2/blog/xkcn.info/posts/photo?api_key=Q6vHoaVm5L1u2ZAW1fqv3Jw48gFzYVg9P0vH0VHl3GVy6quoGV&offset=' + this.state.page)
        .then((response) => response.json())
        .then((responseJson) => {

            this.setState({
                data: this.state.data.concat(responseJson.response.posts),
                dataSource: ds.cloneWithRows(this.state.data.concat(responseJson.response.posts)),
                page: this.state.page + 20
            })
        })
        .catch((error) => {
            console.error(error);
        });
    }

    timeDifference(current, previous) {
        var msPerMinute = 60 * 1000;
        var msPerHour = msPerMinute * 60;
        var msPerDay = msPerHour * 24;
        var msPerMonth = msPerDay * 30;
        var msPerYear = msPerDay * 365;

        var elapsed = current - previous;

        if (elapsed < msPerMinute) {
            return Math.round(elapsed/1000) + ' seconds ago';   
        }

        else if (elapsed < msPerHour) {
            return Math.round(elapsed/msPerMinute) + ' minutes ago';   
        }

        else if (elapsed < msPerDay ) {
            return Math.round(elapsed/msPerHour ) + ' hours ago';   
        }

        else if (elapsed < msPerMonth) {
            return 'approximately ' + Math.round(elapsed/msPerDay) + ' days ago';   
        }

        else if (elapsed < msPerYear) {
            return 'approximately ' + Math.round(elapsed/msPerMonth) + ' months ago';   
        }

        else {
            return 'approximately ' + Math.round(elapsed/msPerYear ) + ' years ago';   
        }
    }   
   
    _onRefresh() {
        this.setState({
            refreshing: true,
            page: 0,
            data: []
        });
        this.getMoviesFromApiAsync().then (
            this.setState({
                refreshing: false
            })
        )
    }

    _onEndReached() {
        this.getMoviesFromApiAsync()
    }

    renderFooter() {
        return(
            <View>
                <Text>Load more</Text>
            </View>
        )
    }

    _onPressButton(rowData, rowIndex) {
        console.log(rowData);
        rowData.liked = !rowData.liked

        const data = [...this.state.data];
        data[rowIndex] = rowData;
        this.setState({
            dataSource: ds.cloneWithRows(data),
        })
        
    }

    renderRow(rowData, sectionIndex, rowIndex) {
        rowData.liked = rowData.liked || false;
        console.log('renderRow - liked', rowData.liked)
        var elLike = <View><Text>Like</Text></View>;
        if(rowData.liked) {
            console.log('liked', rowData.liked);
            elLike = <View><Text>Unlike</Text></View>;
        }

        return(
            <View style={{}}>
                <View>
                    <View>
                        <TouchableOpacity onPress={()=>this._onPressButton(rowData, rowIndex)}>
                            <Image
                                style={{height: 300, flex: 1, resizeMode: 'cover'}}
                                source={{uri: rowData.photos[0].original_size.url}} 
                                indicator={Progress}
                            />
                            {
                                elLike
                            }
                        </TouchableOpacity>
                    </View>

                    <View>
                        <View>
                            <Text>
                                {rowData.summary}
                            </Text>
                        </View>

                        <View>
                            <View />
                        </View>

                        <View>
                            <Text>{rowData.tagsv2}</Text>
                        </View>
                    </View>
                </View>

                <View>
                    <Text>
                        {this.timeDifference(rowData.timestamp)}
                    </Text>
                </View>

                <View />
            </View>

        )
    }

    render() {
        console.log('render');
      return (
        <ListView
            enableEmptySections={true}
            dataSource={this.state.dataSource}
            renderRow={this.renderRow.bind(this)}
            renderFooter={this.renderFooter}
            refreshControl={
                <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh.bind(this)}
                />
            }
            onEndReached={() => this._onEndReached()}
        />
      );
    }
}