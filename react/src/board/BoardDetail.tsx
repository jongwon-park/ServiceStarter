import React from 'react';
import { connectWithDone } from 'app/core/connection';
import { RootState } from 'app/Reducers';
import { Dispatch } from 'redux';
import { Api } from 'app/core/Api';
import * as ApiType from 'types/api.types';
import * as CustomType from 'types/custom.types';
import { InputGroup, FormGroup, InputGroupAddon, Button, InputGroupText, CardBody, Card, CardHeader } from 'reactstrap';
import { AuthState } from 'auth/Auth.action';
import { FaPaperPlane, FaPen, FaTrash } from 'react-icons/fa';
import moment from 'moment';
import { Paginator } from 'component/Paginator';
import autoresize from 'autoresize';
import { AlertSubject } from 'component/Alert';
import { History } from 'history';

interface Props {
    auth:AuthState
    location:Location
    history:History
    done:any
}

type CommentWrap = {
    d:ApiType.BoardComment,
    children:CommentWrap[]
}

class BoardDetail extends React.Component<Props> {
    textarea:any;
    state:{
        item?:ApiType.BoardItem
        user?:CustomType.auth.User
        comments:CommentWrap[]
        commentInput:string
        currentPage:number
        totalPage:number
        nestTarget:number
    } = {
        comments:[],
        commentInput:'',
        currentPage:1,
        totalPage:1,
        nestTarget:-1
    }

    UNSAFE_componentWillMount() {
        const {location, done} = this.props;
        const path = location.pathname.split('/')
        const id = path[path.length-1]
        Api.retrieve<ApiType.BoardItem>('/api-board/item/',id, {
        }).then(item=> {
            this.loadComment(item, 1).then(done, done)
        }, done)
    }

    componentDidUpdate() {
        if (this.textarea) {
            autoresize(this.textarea)
        }
    }

    async loadNestComment(comments:CommentWrap[]) {
        return new Promise(resolve=> {
            Api.list<ApiType.BoardComment[]>('/api-board/comment/', {
                'parent__in[]':comments.map(com=> com.d.id),
            }).then(items=> {
                if (items.length === 0) {
                    resolve()
                } else {
                    const commentWraps:CommentWrap[] = items.map(item=>({d:item, children:[]}))
                    comments.forEach(item=> {
                        commentWraps.filter(child=> child.d.parent === item.d.id)
                        .forEach(child=>item.children.push(child))
                    })
                    this.loadNestComment(commentWraps).then(()=> resolve())
                }
            })
        })
    }

    loadComment(item:ApiType.BoardItem, page:number) {
        return Api.list<{total_page:number,items:ApiType.BoardComment[]}>('/api-board/comment/',{
            item:item.id,
            page:page,
            count_per_page:10,
            parent__isnull:true
        }).then(res=> {
            const commentWraps:CommentWrap[] = res.items.map(item=>({d:item, children:[]}))
            this.loadNestComment(commentWraps).then(()=> {
                this.setState({
                    item:item,
                    currentPage:page,
                    totalPage:res.total_page,
                    comments:commentWraps
                })
            })
        })
    }

    componentDidMount() {
        const {auth} = this.props;
        if (auth.userProfile && typeof auth.userProfile.user === 'number') {
            Api.retrieve<CustomType.auth.User>('/api-user/', auth.userProfile.user, {})
            .then(user=> this.setState({user}))
        }
    }

    comment(parent:ApiType.BoardComment|null=null) {
        const {auth} = this.props;
        if (this.state.item && auth.userProfile && this.state.user) {
            Api.create<ApiType.BoardComment>('/api-board/comment/', {
                content:this.state.commentInput,
                item:this.state.item.id,
                parent:parent ? parent.id : null,
                author:auth.userProfile.id,
                author_name:this.state.user.username
            }).then(res=> {
                this.state.item && this.loadComment(this.state.item, 1)
                this.setState({commentInput:''})
            })
        }
    }

    deleteComment(item:CommentWrap) {
        AlertSubject.next({
            title:'Alert',
            content:'The comment will be deleted',
            onConfirm:()=>{
                Api.delete('/api-board/comment/', item.d.id).then(()=>{
                    this.state.item && this.loadComment(this.state.item, 1)
                })
                AlertSubject.next(undefined)
            },
            onCancel:()=>AlertSubject.next(undefined)
        })
    }

    deleteItem() {
        AlertSubject.next({
            title:'Alert',
            content:'The board item will be deleted',
            onConfirm:()=>{
                this.state.item && Api.delete('/api-board/item/', this.state.item.id).then(()=> {
                    this.props.history.push('/board')
                })
                AlertSubject.next(undefined)
            },
            onCancel:()=>AlertSubject.next(undefined)
        })
    }

    renderInput(item:CommentWrap|null) {
        if (!this.state.user) return <div></div>
        return <FormGroup className="mt-3">
            <InputGroup>
                <InputGroupAddon addonType="prepend">
                    <InputGroupText>{this.state.user.username}</InputGroupText>
                </InputGroupAddon>
                <textarea className="form-control" ref={c=>this.textarea=c} value={this.state.commentInput} onChange={(e)=>{
                    this.setState({commentInput:e.target.value})
                }} rows={1} style={{resize:'none'}}/>
                <InputGroupAddon addonType="append">
                    <Button onClick={()=>this.comment(item ? item.d:null)}><FaPaperPlane /></Button>
                </InputGroupAddon>
            </InputGroup>
        </FormGroup>
    }

    renderComment(item:CommentWrap) {
        const {auth} = this.props;
        return <Card key={item.d.id} className="border-0">
            <CardHeader className="py-1" style={{color:'gray'}}>
                {item.d.author_name}
                <span className="float-right">{moment(item.d.created).fromNow()}</span>
            </CardHeader>
            <CardBody className="pt-1" style={{whiteSpace:'pre'}}>
                {item.d.content}
                {this.state.user && <div className="float-right">
                    <Button className="btn-sm ml-1" color="dark" 
                        onClick={()=>this.setState({nestTarget: item.d.id === this.state.nestTarget ? -1 : item.d.id, commentInput:''})}>
                            <FaPen />
                    </Button> 
                    {auth.userProfile && auth.userProfile.id == item.d.author && <Button className="btn-sm ml-1" color="danger"
                        onClick={()=> this.deleteComment(item)}>
                        <FaTrash></FaTrash>
                    </Button>}
                </div>}
                {this.state.user && item.d.id === this.state.nestTarget && this.renderInput(item)}
            </CardBody>
            <div className="pl-4">{item.children.map(child=> this.renderComment(child))}</div>
        </Card>
    }

    render() {
        const {auth} = this.props;
        if (!this.state.item) return <div></div>
        return <div>
            <h4>{this.state.item.title}</h4>
            <hr />
            <div className="text-right" style={{color:'gray'}}>{new Date(this.state.item.created).toLocaleString()}</div>
            <div className="text-right" style={{color:'gray'}}>{this.state.item.author_name}</div>
            <div dangerouslySetInnerHTML={{__html:this.state.item.content}}></div>
            {auth.userProfile && auth.userProfile.id === this.state.item.author && <div className="text-right">
                <Button color="danger" onClick={()=>this.deleteItem()}>
                    <FaTrash />
                </Button>
            </div>}
            <hr />
            {this.state.comments.map(item=> this.renderComment(item))}
            {this.state.user && this.state.nestTarget === -1 && this.renderInput(null)}
            <div className="d-flex justify-content-center">
                <Paginator 
                    currentPage={this.state.currentPage}
                    totalPage={this.state.totalPage}
                    onSelect={(page:number)=>this.state.item && this.loadComment(this.state.item, page)}/>
            </div>
        </div>
    }
}

export default connectWithDone(
    (state:RootState)=>({
        auth:state.auth
    }),
    (dispatch:Dispatch)=>({}),
    BoardDetail
)