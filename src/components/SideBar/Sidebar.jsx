import React, { useEffect, useState } from 'react'; 
import {
    FaTh,
    FaBars,
    FaUserAlt,
    FaRegChartBar,
    FaCommentAlt,
    FaShoppingBag, 
    FaUserCircle 
}from "react-icons/fa";
import { RiLogoutBoxRLine,RiAdminFill } from "react-icons/ri";
import { NavLink ,useNavigate} from 'react-router-dom';


const Sidebar = ({children}) => {
    const nav=useNavigate();
    const[isOpen ,setIsOpen] = useState(true);
    const [userType,setUserType]=useState('admin');
    const toggle = () =>{ 
        setIsOpen (!isOpen)
    };
    const user=JSON.parse(localStorage.getItem("userType"))
    useEffect(()=>{ 
        setUserType(user) ; 
        if(!user){
            nav("/user/login")
        }
    },[])
    const Admin=[
        {
            path:"/admin/add-product",
            name:"AddProduct",
            icon:<FaTh/>
        },
        // {
        //     path:"/admin/addcart-list",
        //     name:"CartList",
        //     icon:<FaUserAlt/>
        // },
        {
            path:"/admin/order-list",
            name:"OrderList",
            icon:<FaRegChartBar/>
        },
        // {
        //     path:"/admin/shipment",
        //     name:"Shipment",
        //     icon:<FaShoppingBag/>
        // },
       
    ]

    const User=[
        {
            path:"/user/product-list",
            name:"Shop",
            icon:<FaTh/>
        },
        {
            path:"/user/addcart",
            name:"MyCart",
            icon:<FaUserAlt/>
        },
        {
            path:"/user/order",
            name:"MyOrder",
            icon:<FaShoppingBag/>
        },
        // {
        //     path:"/user/shipment",
        //     name:"Shipment",
        //     icon:<FaCommentAlt/>
        // },
        
        
    ]
    
    const handlelogOut = () => {
        // Remove the token and userType from local storage
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("userType"); 
        nav('/');
    };
    

    const renderMenuItems = (items) => {
        return items.map((item, index) => (
            <NavLink to={item.path} key={index} className="link" activeClassName=" " onClick={()=>setIsOpen (true)}>
                <div className="icon">{item.icon}</div>
                <div style={{ display: isOpen ? "block" : "none" }} className="link_text">{item.name}</div>
            </NavLink>
        ));
    };

    
    return (
        <div className="container1">
           <div style={{width: isOpen ? "200px" : "50px"}} className="sidebar">
               <div className="top_section">
                   <h1 style={{display: isOpen ? "block" : "none"}} className="logo"> {userType === 'admin' ? <RiAdminFill/> : <FaUserCircle/>}</h1>
                   <div style={{marginLeft: isOpen ? "50px" : "0px"}} className="bars">
                       <FaBars onClick={toggle}/>
                   </div>
               </div>
               {
                    userType === 'admin' ? renderMenuItems(Admin) : renderMenuItems(User)
               } 
              <div   className="linkLogOut" onClick={handlelogOut}>
                <div className="icon"><RiLogoutBoxRLine /></div>
                <div style={{ display: isOpen ? "block" : "none" }} className="link_text">LouOut</div>
            </div>
           </div>
           <main>{children}</main>
        </div>
    );
};

export default Sidebar;