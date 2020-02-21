import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-elements';
import { S } from '../core/S';
import { connect } from 'react-redux';
import { RootState } from '../core/Reducer';
import { Dispatch } from 'redux';
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import { LoginManager } from 'react-native-fbsdk';
import firebase from 'react-native-firebase';
import { binding } from '../core/connection';
import { AuthAction, AuthState } from './Auth.action';

GoogleSignin.configure({offlineAccess:false})

interface Props {
    auth:AuthState
    AuthAct: typeof AuthAction
}

class SocialSign extends React.Component<Props> {
    
    async googleLogin() {
        try {
            await GoogleSignin.hasPlayServices();
            const data = await GoogleSignin.signIn();
            const crediencial = await GoogleSignin.getTokens()
            const {AuthAct, auth}= this.props
            AuthAct.socialSign('google', data.user.id, 
                data.user.name ? data.user.name : 'noname', 
                crediencial.accessToken, auth.fcmToken)
                .then(res=> console.log('res', res))
                .catch(err=> console.log('err', err))
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
              // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
              // operation (e.g. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
              // play services not available or outdated
            } else {
              // some other error happened
            }
        }
    }

    facebookLogin() {
        
    }

    naverLogin() {

    }

    kakaoLogin() {

    }

    render() {
        return <View>
            <View style={[S.row]}>
                <View style={[S.w50, S.pad]}>
                    <Button buttonStyle={[{backgroundColor:'#d5473a'}]} title="Google" onPress={()=>this.googleLogin()}/>
                </View>
                <View style={[S.w50, S.pad]}>
                    <Button buttonStyle={[{backgroundColor:'#4064ad'}]} title="Facebook" onPress={()=>this.facebookLogin()}/>
                </View>
            </View>
            <View style={[S.row]}>
                <View style={[S.w50, S.pad]}>
                    <Button buttonStyle={[{backgroundColor:'#2caf00'}]} title="Naver" onPress={()=>this.naverLogin()}/>
                </View>
                <View style={[S.w50, S.pad]}>
                    <Button buttonStyle={[{backgroundColor:'#fcdc2f'}]} title="Kakao" onPress={()=>this.kakaoLogin()}/>
                </View>
            </View>
        </View>
    } 
}

export default connect(
    (state:RootState)=>({
        auth:state.auth
    }),
    (dispatch:Dispatch)=>({
        AuthAct:binding(AuthAction, dispatch)
    })
)(SocialSign)