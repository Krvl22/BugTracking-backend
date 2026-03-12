// const UserModel = require("../models/UserModel")
// const bcrypt = require("bcrypt")

// const registerUser = async(req,res)=>{

//     try{
//         //const {firstName,lastName,email,password} = req.body   dont do this for now.,.

//         //10 is salt round.. please check documentation for more details
//         const hashedPassword = await bcrypt.hash(req.body.password,10)

//         //const savedUser = await userSchema.create(req.body)
//         const savedUser = await userSchema.create({...req.body,password:hashedPassword})
//         res.status(201).json({
//             message:"user created successfully",
//             data:savedUser
//         })

        
//     }catch(err){
//         res.status(500).json({
//             message:"error while creating user",
//             err:err.message
//         })
//     }
// }


// module.exports ={
//     registerUser
// }





// const UserModel = require("../models/UserModel")
// const bcrypt = require("bcrypt")

// // ✅ Register
// const registerUser = async(req, res) => {
//     try {
//         const hashedPassword = await bcrypt.hash(req.body.password, 10)

//         const savedUser = await UserModel.create({
//             ...req.body,
//             password: hashedPassword
//         })

//         res.status(201).json({
//             message: "User created successfully",
//             data: savedUser
//         })

//     } catch(err) {
//         console.log(err)
//         res.status(500).json({
//             message: "Error while creating user",
//             err: err.message
//         })
//     }
// }  // ← registerUser closes here ✅

// // ✅ Login — separate function, outside registerUser
// const loginUser = async(req, res) => {
//     try {
//         // 1. Find user by email
//         const user = await UserModel.findOne({ email: req.body.email })
//         if(!user) {
//             return res.status(404).json({
//                 message: "User not found"
//             })
//         }

//         // 2. Check password
//         const isMatch = await bcrypt.compare(req.body.password, user.password)
//         if(!isMatch) {
//             return res.status(401).json({
//                 message: "Invalid password"
//             })
//         }

//         // 3. Send response
//         res.status(200).json({
//             message: "Login successful",
//             data: {
//                 id: user._id,
//                 firstName: user.firstName,
//                 lastName: user.lastName,
//                 email: user.email,
//                 role: user.role
//             }
//         })

//     } catch(err) {
//         console.log(err)
//         res.status(500).json({
//             message: "Error while logging in",
//             err: err.message
//         })
//     }
// }  // ← loginUser closes here ✅

// module.exports = {
//     registerUser,
//     loginUser   
// }
const UserModel = require("../models/UserModel")
const bcrypt = require("bcrypt")
const { mailSend } = require("../utils/MailUtil")

// ================= REGISTER USER =================
const registerUser = async (req, res) => {
    try {

        // Hash password
        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        // Save user
        const savedUser = await UserModel.create({
            ...req.body,
            password: hashedPassword
        })

        // Email Template
        const htmlMessage = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>Welcome to BugTrack</title>
          </head>
          <body style="margin:0;padding:0;background-color:#0d0f14;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">

            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0d0f14;padding:40px 0;">
              <tr>
                <td align="center">

                  <table width="580" cellpadding="0" cellspacing="0" border="0"
                    style="background-color:#13161e;border-radius:16px;overflow:hidden;border:1px solid #1f2433;box-shadow:0 0 40px rgba(0,0,0,0.6);">

                    <!-- Top Accent Bar -->
                    <tr>
                      <td style="background:linear-gradient(90deg,#1a6fd4,#2563eb,#1e40af);height:4px;"></td>
                    </tr>

                    <!-- Header -->
                    <tr>
                      <td align="center" style="padding:40px 48px 28px;">
                        <table cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td align="center">
                              <table cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                  <td style="background:#2563eb;width:10px;height:10px;border-radius:2px;"></td>
                                  <td width="3"></td>
                                  <td style="background:#2563eb;opacity:0.6;width:10px;height:10px;border-radius:2px;"></td>
                                  <td width="3"></td>
                                  <td style="background:#2563eb;opacity:0.3;width:10px;height:10px;border-radius:2px;"></td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr><td height="12"></td></tr>
                          <tr>
                            <td align="center">
                              <span style="font-size:26px;font-weight:700;letter-spacing:2px;color:#ffffff;">BUG<span style="color:#2563eb;">TRACK</span></span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <!-- Divider -->
                    <tr>
                      <td style="padding:0 48px;">
                        <div style="height:1px;background:linear-gradient(90deg,transparent,#1f2a40,transparent);"></div>
                      </td>
                    </tr>

                    <!-- Main Content -->
                    <tr>
                      <td style="padding:36px 48px 0;">
                        <p style="margin:0 0 8px;font-size:13px;letter-spacing:3px;color:#2563eb;text-transform:uppercase;font-weight:600;">Welcome Aboard</p>
                        <h1 style="margin:0 0 20px;font-size:28px;font-weight:700;color:#ffffff;line-height:1.3;">
                          Your account is<br/>ready to go 🚀
                        </h1>
                        <p style="margin:0 0 28px;font-size:15px;color:#8a93a8;line-height:1.7;">
                          Hello <strong style="color:#ffffff;">${savedUser.firstName} ${savedUser.lastName}</strong>, you've successfully joined <strong style="color:#ffffff;">BugTrack</strong> — the platform built to help your team manage bugs, track tasks, and ship better software, faster.
                        </p>
                      </td>
                    </tr>

                    <!-- Info Box -->
                    <tr>
                      <td style="padding:0 48px 28px;">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0"
                          style="background-color:#0d0f14;border-radius:12px;border:1px solid #1f2433;overflow:hidden;">

                          <tr>
                            <td style="padding:20px 24px 16px;">
                              <p style="margin:0;font-size:11px;letter-spacing:2.5px;color:#2563eb;text-transform:uppercase;font-weight:700;">Account Details</p>
                            </td>
                          </tr>

                          <tr>
                            <td style="padding:0 24px 14px;">
                              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                  <td width="32" valign="top">
                                    <div style="width:24px;height:24px;background:#1a2a4a;border:1px solid #2a3f6f;border-radius:6px;text-align:center;line-height:24px;font-size:13px;color:#2563eb;font-weight:700;">@</div>
                                  </td>
                                  <td style="padding-left:12px;">
                                    <p style="margin:0;font-size:13px;font-weight:600;color:#dde1ea;">Email Address</p>
                                    <p style="margin:3px 0 0;font-size:12px;color:#5a6278;">${savedUser.email}</p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>

                          <tr>
                            <td style="padding:0 24px 20px;">
                              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                  <td width="32" valign="top">
                                    <div style="width:24px;height:24px;background:#1a2a4a;border:1px solid #2a3f6f;border-radius:6px;text-align:center;line-height:24px;font-size:13px;color:#2563eb;font-weight:700;">R</div>
                                  </td>
                                  <td style="padding-left:12px;">
                                    <p style="margin:0;font-size:13px;font-weight:600;color:#dde1ea;">Your Role</p>
                                    <p style="margin:3px 0 0;font-size:12px;color:#5a6278;">${savedUser.role}</p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>

                        </table>
                      </td>
                    </tr>

                    <!-- CTA Button -->
                    <tr>
                      <td align="center" style="padding:0 48px 36px;">
                        <a href="http://localhost:5173/" style="display:inline-block;background:linear-gradient(135deg,#2563eb,#1a6fd4);color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;letter-spacing:1px;padding:14px 40px;border-radius:8px;text-transform:uppercase;">
                          Login to BugTrack →
                        </a>
                      </td>
                    </tr>

                    <!-- Divider -->
                    <tr>
                      <td style="padding:0 48px;">
                        <div style="height:1px;background:linear-gradient(90deg,transparent,#1f2a40,transparent);"></div>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="background-color:#0d0f14;padding:24px 48px;border-top:1px solid #1a1d27;">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td>
                              <p style="margin:0 0 4px;font-size:12px;color:#3e4557;">© 2026 BugTrack. All rights reserved.</p>
                              <p style="margin:0;font-size:11px;color:#2e3447;">
                                If you didn't create this account, you can safely ignore this email.
                              </p>
                            </td>
                            <td align="right" valign="middle">
                              <table cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                  <td style="background:#2563eb;width:6px;height:6px;border-radius:1px;"></td>
                                  <td width="2"></td>
                                  <td style="background:#2563eb;opacity:0.5;width:6px;height:6px;border-radius:1px;"></td>
                                  <td width="2"></td>
                                  <td style="background:#2563eb;opacity:0.2;width:6px;height:6px;border-radius:1px;"></td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                  </table>

                </td>
              </tr>
            </table>

          </body>
          </html>
        `

        // Send Email
        await mailSend(
            savedUser.email,
            "Welcome to Bug Tracker",
            htmlMessage
        )

        res.status(201).json({
            message: "User created successfully",
            data: savedUser
        })

    } catch (err) {

        console.log(err)

        res.status(500).json({
            message: "Error while creating user",
            err: err.message
        })
    }
}


// ================= LOGIN USER =================
const loginUser = async (req, res) => {

    try {

        // ✅ FIXED: Added .select("+password") because password has select:false in UserModel
        const user = await UserModel.findOne({ email: req.body.email }).select("+password")

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password)

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid password"
            })
        }

        res.status(200).json({
            message: "Login successful",
            data: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        })

    } catch (err) {

        console.log(err)

        res.status(500).json({
            message: "Error while logging in",
            err: err.message
        })
    }
}


module.exports = {
    registerUser,
    loginUser
}