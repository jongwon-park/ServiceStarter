
import React from 'react';
import { View, Text } from 'react-native';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { Button, ThemeProvider } from 'react-native-elements';
import { NotificationService } from './service/NotificationService';

interface Props {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

export default class Home extends React.Component<Props> {

    render() {
        return <View>
            <Button title="Test" onPress={()=>this.props.navigation.navigate('Test')} />
            <Button title="Setting" onPress={()=>this.props.navigation.navigate('Setting')}/>
        </View>
    }
}