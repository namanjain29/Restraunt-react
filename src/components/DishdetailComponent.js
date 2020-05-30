import React, { Component } from 'react';
import {
    Card, CardImg, CardText, CardBody, Button,
    CardTitle, Breadcrumb, BreadcrumbItem, Row,
    Col, Modal, ModalHeader, ModalBody, Label,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from "react-redux-form"
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';


const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => !(val) || (val.length >= len);

class CommentForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    handleSubmit(values) {
        this.toggleModal();
        this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);

    }


    render() {
        return (
            <div>
                <Button outline onClick={this.toggleModal}>
                    <span className="fa fa-pencil fa-lg"></span> Submit Comment
                </Button>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggleModal}>
                        Submit Comment
                </ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                            <Row className="form-group">
                                <div className="col-12">
                                    <Label htmlFor="rating"> Rating </Label>
                                </div>
                                <div className="col-12">
                                    <Control.select className="col-12 form-control" model=".rating" id="rating" name="rating">
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </Control.select>
                                </div>
                            </Row>
                            <Row className="form-group">
                                <div className="col-12">
                                    <Label htmlFor="rating"> Your Name </Label>
                                </div>
                                <div className="col-12">
                                    <Control.text className="col-12 form-control"
                                        model=".author"
                                        id="author"
                                        placeholder="Your Name"
                                        validators={{
                                            required,
                                            minLength: minLength(3),
                                            maxLength: maxLength(15)
                                        }}>
                                    </Control.text>
                                    <Errors
                                        className="text-danger"
                                        model=".author"
                                        show="touched"
                                        messages={{
                                            required: 'Required',
                                            minLength: 'Must be greater than 2 characters',
                                            maxLength: 'Must be 15 characters or less'
                                        }}
                                    >
                                    </Errors>
                                </div>
                            </Row>
                            <Row className="form-group">
                                <div className="col-12">
                                    <Label htmlFor="rating"> Comment </Label>
                                </div>
                                <div className="col-12">
                                    <Control.textarea className="col-12 form-control" model=".comment" rows="6" id="comment" >
                                    </Control.textarea>
                                </div>
                            </Row>
                            <Row className="form-group">
                                <Col>
                                    <Button color="primary" type="submit">
                                        Submit
                                    </Button>
                                </Col>
                            </Row>
                        </LocalForm>
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}




function RenderComments({ comments, postComment, dishId }) {
    if (comments != null) {
        const list_comments = comments.map(comment => {
            return (
                <li key={comment.id}>
                    <p>{comment.comment}</p>
                    <p>-- {comment.author},
                        &nbsp;
                        {new Intl.DateTimeFormat('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: '2-digit'
                    }).format(new Date(Date.parse(comment.date)))}
                    </p>
                </li>
            )
        })
        console.log(list_comments)
        return (
            <div className='col-12 col-md-5 m-1'>
                <h4> Comments </h4>
                <Stagger in>
                    {comments.map((comment) => {
                        return (
                            <Fade in>
                                <li key={comment.id}>
                                    <p>{comment.comment}</p>
                                    <p>-- {comment.author} , {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(Date.parse(comment.date)))}</p>
                                </li>
                            </Fade>
                        );
                    })}
                </Stagger>
                <CommentForm dishId={dishId} postComment={postComment} />
            </div>
        )
    } else {
        return (
            <div>
                <CommentForm dishId={dishId} postComment={postComment} />            </div>
        )
    }
}

function RenderDish(dish) {
    if (dish != null) {
        return (
            <div className='col-12 col-md-5 m-1'>
                <FadeTransform
                    in
                    transformProps={{
                        exitTransform: 'scale(0.5) translateY(-50%)'
                    }}>
                    <Card>
                        <CardImg top src={baseUrl + dish.image} alt={dish.name} />
                        <CardBody>
                            <CardTitle>{dish.name}</CardTitle>
                            <CardText>{dish.description}</CardText>
                        </CardBody>
                    </Card>
                </FadeTransform>
            </div>
        )
    }
    else {
        return (
            <div></div>
        )
    };
}


const DishDetail = (props) => {
    if (props.isLoading) {
        return (
            <div className="container">
                <div className="row">
                    <Loading />
                </div>
            </div>
        );
    }
    else if (props.errMess) {
        return (
            <div className="container">
                <div className="row">
                    <h4>{props.errMess}</h4>
                </div>
            </div>
        );
    }
    else if (props.dish == null) {
        return (<div></div>)
    }
    const dishItem = RenderDish(props.dish)
    console.log(props)
    return (
        <div className="container">
            <div className="row">
                <Breadcrumb>
                    <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                    <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                </Breadcrumb>
                <div className="col-12">
                    <h3>{props.dish.name}</h3>
                    <hr />
                </div>
            </div>
            <div className="row">
                {dishItem}
                <RenderComments comments={props.comments}
                    postComment={props.postComment}
                    dishId={props.dish.id}
                />
            </div>
        </div>
    )
}

export default DishDetail


