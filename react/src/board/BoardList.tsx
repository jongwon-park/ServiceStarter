import React from 'react';
import { RootState } from 'app/Reducers';
import { Dispatch } from 'redux';
import { binding, connectWithoutDone } from 'app/core/connection';
import { BoardState, BoardAction } from './Board.action';
import { Paginator } from 'component/Paginator';
import { Button, Table } from 'reactstrap';
import { AuthState } from 'auth/Auth.action';
import { History } from 'history';
import moment from 'moment';
import { Api } from 'app/core/Api';
import * as ApiType from 'types/api.types';
interface Props {
    auth:AuthState
    board:BoardState
    BoardAction:typeof BoardAction
    done:any
    history:History
}

class BoardList extends React.Component<Props> {

    componentDidMount() {
        const {board, BoardAction} = this.props;
        if (board.activeGroup) {
            BoardAction.boardList(1, board.activeGroup)
        }
    }

    changePage(page:number) {
        const {BoardAction, board} = this.props;
        if (board.activeGroup) {
            BoardAction.boardList(page, board.activeGroup)
        }
    }

    write() {
        const { board, auth, history } = this.props;
        if (board.activeGroup && auth.userProfile) {
            Api.create<ApiType.BoardItem>('/api-board/item/', {
                title:'',
                content:'',
                group:board.activeGroup.id,
                author:auth.userProfile.id,
                author_name:auth.userProfile.name
            }).then(res=> history.push('/board/write/'+res.id))
        }
    }

    render() {
        const {auth, board, history} = this.props;
        return <div>
            <h4>{board.activeGroup && board.activeGroup.name}</h4>
            <Table hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Created</th>
                    </tr>
                </thead>
                <tbody>
                    {board.list.map(item=> <tr key={item.id}>
                        <th scope="row"><a onClick={()=>history.push('/board/'+item.id)}>{item.id}</a></th>
                        <td><a onClick={()=>history.push('/board/'+item.id)}>{item.title}</a></td>
                        <td><a onClick={()=>history.push('/board/'+item.id)}>{item.author_name}</a></td>
                        <td><a onClick={()=>history.push('/board/'+item.id)}>{moment(item.created).fromNow()}</a></td>
                    </tr>)}
                </tbody>
            </Table>
            {auth.userProfile && <Button color="primary" className="float-right" onClick={()=>this.write()}>Write</Button>}
            <Paginator 
                currentPage={board.currentPage}
                totalPage={board.totalPage}
                onSelect={(page:number)=>this.changePage(page)}/>
        </div>
    }
}

export default connectWithoutDone(
    (state:RootState)=>({
        auth:state.auth,
        board:state.board
    }),
    (dispatch:Dispatch)=>({
        BoardAction:binding(BoardAction, dispatch)
    }),
    BoardList
)