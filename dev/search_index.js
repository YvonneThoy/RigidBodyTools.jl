var documenterSearchIndex = {"docs":
[{"location":"manual/methods/#Index","page":"Index","title":"Index","text":"","category":"section"},{"location":"manual/methods/","page":"Index","title":"Index","text":"DocTestSetup = quote\n  using RigidBodyTools\nend","category":"page"},{"location":"manual/methods/","page":"Index","title":"Index","text":"Modules  = [RigidBodyTools]\nOrder   = [:type, :function]","category":"page"},{"location":"manual/methods/#RigidBodyTools.BasicBody","page":"Index","title":"RigidBodyTools.BasicBody","text":"BasicBody(x,y[,closuretype=ClosedBody]) <: Body\n\nConstruct a body by simply passing in the x and y coordinate vectors. The last point will be automatically connected to the first point. The coordinate vectors are assumed to be expressed in the body-fixed coordinate system. The optional closuretype specifies whether the body is closed (ClosedBody) or open (OpenBody). If closed, then the first and last points are assumed joined in operations that require neighbor points.\n\n\n\n\n\n","category":"type"},{"location":"manual/methods/#RigidBodyTools.ConstantProfile","page":"Index","title":"RigidBodyTools.ConstantProfile","text":"ConstantProfile(c::Number)\n\nCreate a profile consisting of a constant c.\n\nExample\n\njulia> p = RigidBodyMotions.ConstantProfile(1.0)\nConstant (2.3)\n\n\n\n\n\n","category":"type"},{"location":"manual/methods/#RigidBodyTools.Ellipse","page":"Index","title":"RigidBodyTools.Ellipse","text":"Ellipse(a,b,n) <: Body\n\nConstruct an elliptical body with semi-major axis a and semi-minor axis b, with n points distributed on the body perimeter.\n\n\n\n\n\n","category":"type"},{"location":"manual/methods/#RigidBodyTools.Kinematics","page":"Index","title":"RigidBodyTools.Kinematics","text":"An abstract type for types that takes in time and returns (c, ċ, c̈, α, α̇, α̈).\n\n\n\n\n\n","category":"type"},{"location":"manual/methods/#RigidBodyTools.NACA4","page":"Index","title":"RigidBodyTools.NACA4","text":"NACA4(cam,pos,thick,np,[len=1.0]) <: Body{N}\n\nGenerates points in the shape of a NACA 4-digit airfoil of chord length 1. The relative camber is specified by cam, the position of maximum camber (as fraction of chord) by pos, and the relative thickness by thick. The parameter np specifies the number of points on the upper or lower surface. The optional parameter len specifies the chord length, which defaults to 1.0.\n\nExample\n\njulia> w = Bodies.NACA4(0.0,0.0,0.12);\n\n\n\n\n\n","category":"type"},{"location":"manual/methods/#RigidBodyTools.PitchHeave","page":"Index","title":"RigidBodyTools.PitchHeave","text":"PitchHeave <: Kinematics\n\nKinematics describing an oscillatory pitching and heaving (i.e. plunging) motion\n\nConstructors\n\nFields\n\nU₀\nFreestream velocity\na\nAxis of pitch rotation, relative to the plate centroid\nK\nReduced frequency K = fracOmega c2U_0\nϕp\nPhase of pitch (in radians)\nϕh\nPhase of heave (in radians)\nα₀\nMean angle of attack\nΔα\nAmplitude of pitching\nA\nAmplitude of translational heaving\nY\nẎ\nŸ\nα\nα̇\nα̈\n\n\n\n\n\n","category":"type"},{"location":"manual/methods/#RigidBodyTools.Pitchup","page":"Index","title":"RigidBodyTools.Pitchup","text":"Pitchup <: Kinematics\n\nKinematics describing a pitchup motion (horizontal translation with rotation)\n\nConstructors\n\nFields\n\nU₀\nFreestream velocity\na\nAxis of rotation, relative to the plate centroid\nK\nNon-dimensional pitch rate K = dotalpha_0fracc2U_0\nα₀\nInitial angle of attack\nt₀\nNominal start of pitch up\nΔα\nTotal pitching angle\nα\nα̇\nα̈\n\n\n\n\n\n","category":"type"},{"location":"manual/methods/#RigidBodyTools.Plate","page":"Index","title":"RigidBodyTools.Plate","text":"Plate(length,thick,n,[λ=1.0]) <: Body\n\nConstruct a flat plate with length length and thickness thick, with n points distributed on the body perimeter.\n\nThe optional parameter λ distributes the points differently. Values between 0.0 and 1.0 are accepted.\n\nThe constructor Plate(length,n,[λ=1.0]) creates a plate of zero thickness.\n\nAlternatively, either form can be specified with a target spacing in place of n.\n\n\n\n\n\n","category":"type"},{"location":"manual/methods/#RigidBodyTools.Profile","page":"Index","title":"RigidBodyTools.Profile","text":"An abstract type for real-valued functions of time.\n\n\n\n\n\n","category":"type"},{"location":"manual/methods/#RigidBodyTools.Rectangle","page":"Index","title":"RigidBodyTools.Rectangle","text":"Rectangle(a,b,na) <: Body\n\nConstruct a rectangular body with x̃ side half-length a and ỹ side half-length b, with na points distributed on the x̃ side (including both corners). The centroid of the rectangle is placed at the origin (so that the lower left corner is at (-a,-b)).\n\n\n\n\n\n","category":"type"},{"location":"manual/methods/#RigidBodyTools.RigidBodyMotion","page":"Index","title":"RigidBodyTools.RigidBodyMotion","text":"RigidBodyMotion\n\nA type to store the body's current kinematics\n\nFields\n\nc: current centroid position (relative to initial position)\nċ: current centroid velocity\nc̈: current centroid acceleration\nα: current angle (relative to initial angle)\nα̇: current angular velocity\nα̈: current angular acceleration\nkin: a Kinematics structure\n\nThe first six fields are meant as a cache of the current kinematics while the kin field can be used to find the plate kinematics at any time.\n\n\n\n\n\n","category":"type"},{"location":"manual/methods/#RigidBodyTools.RigidTransform","page":"Index","title":"RigidBodyTools.RigidTransform","text":"RigidTransform(x::Tuple{Float64,Float64},α::Float64)\n\nConstruct a rigid-body transform operator, with rotation by angle α and translation specified by x. The translation coordinates are specified in the target coordinate system.\n\nThe resulting transform can be used as an operator on pairs of coordinate vectors, x and y, or on bodies. For transformation of bodies, it only overwrites the x and y fields of the body, but leaves the x̃ and ỹ (body coordinates) intact.\n\nThe translation can be provided as either a tuple (x,y) or as a complex number.\n\nConstructors\n\nRigidTransform((x,y),α)\nRigidTransform(u::Vector{Float64})\nRigidTransform(u::NTuple{3,Float64})\nRigidTransform.(u) where u is a collection of vectors or tuples.\n\nExample\n\njulia> body = Bodies.Ellipse(0.5,0.1,100)\nElliptical body with 100 points and semi-axes (0.5,0.1)\n   Current position: (0.0,0.0)\n   Current angle (rad): 0.0\n\njulia> T = RigidTransform((1.0,1.0),π/4)\nRigid-body transform\n  Translation: (1.0,1.0)\n  Rotation angle (rad): 0.7853981633974483\n\njulia> T(body)\nElliptical body with 100 points and semi-axes (0.5,0.1)\n   Current position: (1.0,1.0)\n   Current angle (rad): 0.7853981633974483\n\n\n\n\n\n","category":"type"},{"location":"manual/methods/#RigidBodyTools.RigidTransformList-Tuple{BodyList}","page":"Index","title":"RigidBodyTools.RigidTransformList","text":"(tl::RigidTransformList)(bl::BodyList) -> BodyList\n\nCarry out in-place transformations of each body in bl with the corresponding transformation in tl. \n\n\n\n\n\n","category":"method"},{"location":"manual/methods/#RigidBodyTools.SwitchedKinematics","page":"Index","title":"RigidBodyTools.SwitchedKinematics","text":"SwitchedKinematics <: Kinematics\n\nModulates a given set of kinematics between simple on/off states. The velocity specified by the given kinematics is toggled on/off.\n\nFields\n\nt_on\ntime at which the kinematics should be turned on\nt_off\ntime at which the kinematics should be turned off\nkin\nkinematics to be followed in the on state\noff\n\n\n\n\n\n","category":"type"},{"location":"manual/methods/#Base.:*-Tuple{Number,RigidBodyTools.Profile}","page":"Index","title":"Base.:*","text":"s::Number * p::Profile\n\nReturns a scaled profile with (s*p)(t) = s*p(t)\n\nExample\n\njulia> s = Plates.RigidBodyMotions.Sinusoid(π)\nSinusoid (ω = 3.14)\n\njulia> 2s\n2 × (Sinusoid (ω = 3.14))\n\njulia> (2s).([0.0, 0.5, 0.75])\n3-element Array{Float64,1}:\n 0.0\n 2.0\n 1.41421\n\n\n\n\n\n","category":"method"},{"location":"manual/methods/#Base.:+-Tuple{RigidBodyTools.Profile,RigidBodyTools.AddedProfiles}","page":"Index","title":"Base.:+","text":"p₁::Profile + p₂::Profile\n\nAdd the profiles so that (p₁ + p₂)(t) = p₁(t) + p₂(t).\n\nExamples\n\njulia> ramp₁ = Plates.RigidBodyMotions.EldredgeRamp(5)\nlogcosh ramp (aₛ = 5.0)\n\njulia> ramp₂ = Plates.RigidBodyMotions.ColoniusRamp(5)\npower series ramp (n = 5.0)\n\njulia> ramp₁ + ramp₂\nAddedProfiles:\n  logcosh ramp (aₛ = 5.0)\n  power series ramp (n = 5.0)\n\n\njulia> ramp₁ + (ramp₂ + ramp₁) == ramp₁ + ramp₂ + ramp₁\ntrue\n\n\n\n\n\n\n","category":"method"},{"location":"manual/methods/#Base.:--Tuple{RigidBodyTools.Profile}","page":"Index","title":"Base.:-","text":"-(p₁::Profile, p₂::Profile)\n\njulia> s = Plates.RigidBodyMotions.Sinusoid(π)\nSinusoid (ω = 3.14)\n\njulia> 2s\n2 × (Sinusoid (ω = 3.14))\n\njulia> (2s).([0.0, 0.5, 0.75])\n3-element Array{Float64,1}:\n 0.0\n 2.0\n 1.41421\n\njulia> s = Plates.RigidBodyMotions.Sinusoid(π);\n\njulia> s.([0.0, 0.5, 0.75])\n3-element Array{Float64,1}:\n 0.0\n 1.0\n 0.707107\n\njulia> (-s).([0.0, 0.5, 0.75])\n3-element Array{Float64,1}:\n -0.0\n -1.0\n -0.707107\n\njulia> (s - s).([0.0, 0.5, 0.75])\n3-element Array{Float64,1}:\n 0.0\n 0.0\n 0.0\n\n\n\n\n\n","category":"method"},{"location":"manual/methods/#Base.:>>-Tuple{RigidBodyTools.Profile,Number}","page":"Index","title":"Base.:>>","text":"p::Profile >> Δt::Number\n\nShift the profile in time so that (p >> Δt)(t) = p(t - Δt)\n\nExample\n\njulia> s = Plates.RigidBodyMotions.Sinusoid(π);\n\njulia> s >> 0.5\nSinusoid (ω = 3.14) >> 0.5\n\njulia> (s >> 0.5).([0.0, 0.5, 0.75])\n3-element Array{Float64,1}:\n -1.0\n  0.0\n  0.707107\n\njulia> (s << 0.5).([0.0, 0.5, 0.75])\n3-element Array{Float64,1}:\n  1.0\n  1.22465e-16\n -0.707107\n\n\n\n\n\n","category":"method"},{"location":"manual/methods/#Base.collect-Tuple{BodyList}","page":"Index","title":"Base.collect","text":"collect(bl::bodylist) -> Vector{Float64}, Vector{Float64}\n\nCollect the inertial-space coordinates of all of the Lagrange points comprising the bodies in body list bl and return each assembled set of coordinates as a vector.\n\n\n\n\n\n","category":"method"},{"location":"manual/methods/#Base.diff-Union{Tuple{Body{N,C}}, Tuple{C}, Tuple{N}} where C<:RigidBodyTools.BodyClosureType where N","page":"Index","title":"Base.diff","text":"diff(body::Body/BodyList) -> Tuple{Vector{Float64},Vector{Float64}}\n\nCompute the x and y differences of the faces on the perimeter of body body, whose ends are at the current x and y coordinates (in inertial space) of the body. Face 1 corresponds to the face between points 1 and 2, for example.\n\nIf body is a BodyList, then it computes the differences separately on each constituent body.\n\n\n\n\n\n","category":"method"},{"location":"manual/methods/#Base.length-Union{Tuple{Body{N,C} where C<:RigidBodyTools.BodyClosureType}, Tuple{N}} where N","page":"Index","title":"Base.length","text":"length(body::Body)\n\nReturn the number of points on the body perimeter\n\n\n\n\n\n","category":"method"},{"location":"manual/methods/#Base.sum-Tuple{AbstractArray{T,1} where T,BodyList,Int64}","page":"Index","title":"Base.sum","text":"sum(f::AbstractVector,bl::BodyList,i::Int) -> Real\n\nCompute a sum of the elements of vector f corresponding to body i in body list bl.\n\n\n\n\n\n","category":"method"},{"location":"manual/methods/#Base.vec-Tuple{RigidTransform}","page":"Index","title":"Base.vec","text":"vec(T::RigidTransform) -> Vector{Float64}\n\nReturns a length-3 vector of the form [x,y,α] corresponding to the translation and rotation specified by the given transform T.\n\n\n\n\n\n","category":"method"},{"location":"manual/methods/#Base.vec-Union{Tuple{Array{RigidTransform,1}}, Tuple{N}} where N","page":"Index","title":"Base.vec","text":"vec(tl::Vector{RigidTransform}) -> Vector{Float64}\n\nReturns a concatenation of length-3 vectors of the form [x,y,α] corresponding to the translation and rotation specified by the given by the list of transforms tl.\n\n\n\n\n\n","category":"method"},{"location":"manual/methods/#Base.view-Tuple{AbstractArray{T,1} where T,BodyList,Int64}","page":"Index","title":"Base.view","text":"view(f::AbstractVector,bl::BodyList,i::Int) -> SubArray\n\nProvide a view of the range of values in vector f corresponding to the Lagrange points of the body with index i in a BodyList bl.\n\n\n\n\n\n","category":"method"},{"location":"manual/methods/#RigidBodyTools.Circle-Tuple{Real,Float64}","page":"Index","title":"RigidBodyTools.Circle","text":"Circle(a,targetsize::Float64) <: Body\n\nConstruct a circular body with radius a with spacing between points set approximately to targetsize.\n\n\n\n\n\n","category":"method"},{"location":"manual/methods/#RigidBodyTools.Circle-Tuple{Real,Int64}","page":"Index","title":"RigidBodyTools.Circle","text":"Circle(a,n) <: Body\n\nConstruct a circular body with radius a and with n points distributed on the body perimeter.\n\n\n\n\n\n","category":"method"},{"location":"manual/methods/#RigidBodyTools.SplinedBody-Tuple{Array{Float64,2},Float64}","page":"Index","title":"RigidBodyTools.SplinedBody","text":"SplinedBody(X,Δx[,closuretype=ClosedBody]) -> BasicBody\n\nUsing control points in X (assumed to be N x 2, where N is the number of points), create a set of points that are uniformly spaced (with spacing Δx) on a curve that passes through the control points. A cubic parametric spline algorithm is used. If the optional parameter closuretype is set to OpenBody, then the end points are not joined together.\n\n\n\n\n\n","category":"method"},{"location":"manual/methods/#RigidBodyTools.Square-Tuple{Real,Int64}","page":"Index","title":"RigidBodyTools.Square","text":"Square(a,na) <: Body\n\nConstruct a square body with side half-length a and with na points distributed on each side (including both corners).\n\n\n\n\n\n","category":"method"},{"location":"manual/methods/#RigidBodyTools.assign_velocity!-Tuple{AbstractArray{Float64,1},AbstractArray{Float64,1},AbstractArray{Float64,1},AbstractArray{Float64,1},Real,Real,Real,RigidBodyMotion,Real}","page":"Index","title":"RigidBodyTools.assign_velocity!","text":"assign_velocity!(u::AbstractVector{Float64},v::AbstractVector{Float64},\n                 x::AbstractVector{Float64},y::AbstractVector{Float64},\n                 xc::Real,yc::Real,α::Real,\n                 motion,t::Real)\n\nAssign the components of rigid body velocity u and v (in inertial coordinate system) at positions described by coordinates x, y (also in inertial coordinate system) at time t, based on supplied motion motion for the body.\n\n\n\n\n\n","category":"method"},{"location":"manual/methods/#RigidBodyTools.assign_velocity!-Tuple{AbstractArray{Float64,1},AbstractArray{Float64,1},Body,RigidBodyMotion,Real}","page":"Index","title":"RigidBodyTools.assign_velocity!","text":"assign_velocity!(u::AbstractVector{Float64},v::AbstractVector{Float64},\n             body::Body,motion::RigidBodyMotion,t::Real)\n\nAssign the components of rigid body velocity u and v (in inertial coordinate system) at positions described by coordinates inertial coordinates in body in body at time t, based on supplied motions in the RigidBodyMotion motion for the body.\n\n\n\n\n\n","category":"method"},{"location":"manual/methods/#RigidBodyTools.assign_velocity!-Tuple{AbstractArray{Float64,1},AbstractArray{Float64,1},BodyList,RigidMotionList,Real}","page":"Index","title":"RigidBodyTools.assign_velocity!","text":"assign_velocity!(u::AbstractVector{Float64},v::AbstractVector{Float64},\n                 bl::BodyList,ml::RigidMotionList,t::Real)\n\nAssign the components of rigid body velocity u and v (in inertial coordinate system) at positions described by coordinates inertial coordinates in each body in bl at time t, based on supplied motions in the RigidMotionList ml for each body.\n\n\n\n\n\n","category":"method"},{"location":"manual/methods/#RigidBodyTools.assign_velocity-Tuple{AbstractArray{Float64,1},AbstractArray{Float64,1},Real,Real,Real,RigidBodyMotion,Real}","page":"Index","title":"RigidBodyTools.assign_velocity","text":"assign_velocity(x::AbstractVector{Float64},y::AbstractVector{Float64},\n                xc::Real,yc::Real,α::Real,motion,t::Real)\n\nReturn the components of rigid body velocities (in inertial components) at positions described by coordinates x, y (also in inertial coordinate system) at time t, based on supplied motion motion for the body.\n\n\n\n\n\n","category":"method"},{"location":"manual/methods/#RigidBodyTools.assign_velocity-Tuple{Body,Vararg{Any,N} where N}","page":"Index","title":"RigidBodyTools.assign_velocity","text":"assign_velocity(body::Body,motion::RigidBodyMotion,t::Real)\n\nReturn the components of rigid body velocity (in inertial coordinate system) at positions described by coordinates inertial coordinates in body in body at time t, based on supplied motions in the RigidBodyMotion motion for the body.\n\nAs a shorthand, you can also apply this as motion(t,body).\n\n\n\n\n\n","category":"method"},{"location":"manual/methods/#RigidBodyTools.assign_velocity-Tuple{BodyList,RigidMotionList,Real}","page":"Index","title":"RigidBodyTools.assign_velocity","text":"assign_velocity(bl::BodyList,ml::RigidMotionList,t::Real)\n\nReturn the components of rigid body velocity (in inertial coordinate system) at positions described by coordinates inertial coordinates in each body in bl at time t, based on supplied motions in the RigidMotionList ml for each body.\n\nAs a shorthand, you an also apply this as ml(t,bl).\n\n\n\n\n\n","category":"method"},{"location":"manual/methods/#RigidBodyTools.centraldiff-Union{Tuple{Body{N,C}}, Tuple{C}, Tuple{N}} where C<:RigidBodyTools.BodyClosureType where N","page":"Index","title":"RigidBodyTools.centraldiff","text":"centraldiff(body::Body/BodyList) -> Tuple{Vector{Float64},Vector{Float64}}\n\nCompute the circular central differences of coordinates on body body (or on each body in list body).\n\n\n\n\n\n","category":"method"},{"location":"manual/methods/#RigidBodyTools.d_dt-Tuple{RigidBodyTools.Profile}","page":"Index","title":"RigidBodyTools.d_dt","text":"d_dt(p::Profile)\n\nTake the time derivative of p and return it as a new profile.\n\nExample\n\njulia> s = Plates.RigidBodyMotions.Sinusoid(π)\nSinusoid (ω = 3.14)\n\njulia> s.([0.0, 0.5, 0.75])\n3-element Array{Float64,1}:\n 0.0\n 1.0\n 0.707107\n\njulia> c = Plates.RigidBodyMotions.d_dt(s)\nd/dt (Sinusoid (ω = 3.14))\n\njulia> c.([0.0, 0.5, 0.75])\n3-element Array{Float64,1}:\n  3.14159\n  1.92367e-16\n -2.22144\n\n\n\n\n\n","category":"method"},{"location":"manual/methods/#RigidBodyTools.dlength-Tuple{Union{BodyList, Body}}","page":"Index","title":"RigidBodyTools.dlength","text":"dlength(body::Body/BodyList) -> Vector{Float64}\n\nCompute the lengths of the faces on the perimeter of body body, whose ends are at the current x and y coordinates (in inertial space) of the body. Face 1 corresponds to the face between points 1 and 2, for example. For an OpenBody, this provides a vector that is one element shorter than the number of points, to ensure that sum(dlength(body)) is equal to the arclength of the body.\n\n\n\n\n\n","category":"method"},{"location":"manual/methods/#RigidBodyTools.dlengthmid-Tuple{Union{BodyList, Body}}","page":"Index","title":"RigidBodyTools.dlengthmid","text":"dlengthmid(body::Body/BodyList) -> Vector{Float64}\n\nCompute the lengths of the faces formed between the face midpoints on the perimeter of body body. The indexing of these midpoint faces is consistent with that of the regular vertex points adjacent to both midpoints. Midpoint face 2 corresponds to the face between midpoints 1 and 2, for example. For an OpenBody, the lengths for the first and last points are calculated to the adjoining midpoints, to ensure that sum(dlength(body)) is equal to the arclength of the body.\n\n\n\n\n\n","category":"method"},{"location":"manual/methods/#RigidBodyTools.getrange-Tuple{BodyList,Int64}","page":"Index","title":"RigidBodyTools.getrange","text":"getrange(bl::BodyList,i::Int) -> Range\n\nReturn the subrange of indices in the global set of surface point data corresponding to body i in a BodyList bl.\n\n\n\n\n\n","category":"method"},{"location":"manual/methods/#RigidBodyTools.midpoints-Union{Tuple{Body{N,C}}, Tuple{C}, Tuple{N}} where C<:RigidBodyTools.BodyClosureType where N","page":"Index","title":"RigidBodyTools.midpoints","text":"midpoints(body::Body/BodyList) -> Tuple{Vector{Float64},Vector{Float64}}\n\nCompute the x and y midpoints of the faces on the perimeter of body body, whose ends are at the current x and y coordinates (in inertial space) of the body. Face 1 corresponds to the face between points 1 and 2, for example.\n\nIf body is a BodyList, then it computes the differences separately on each constituent body.\n\n\n\n\n\n","category":"method"},{"location":"manual/methods/#RigidBodyTools.normal-Tuple{Union{BodyList, Body}}","page":"Index","title":"RigidBodyTools.normal","text":"normal(body::Body/BodyList) -> Tuple{Vector{Float64},Vector{Float64}}\n\nCompute the current normals (in inertial components) of the faces on the perimeter of body body, whose ends are at the current x and y coordinates (in inertial space) of the body. Face 1 corresponds to the face between points 1 and 2, for example. For an OpenBody, this provides a vector that is one element shorter than the number of points.\n\n\n\n\n\n","category":"method"},{"location":"manual/methods/#RigidBodyTools.normalmid-Tuple{Union{BodyList, Body}}","page":"Index","title":"RigidBodyTools.normalmid","text":"normalmid(body::Body/BodyList) -> Tuple{Vector{Float64},Vector{Float64}}\n\nCompute the current normals (in inertial components) of the faces formed between midpoints on the perimeter of body body (or each body in list body). For an OpenBody, the normals for the first and last points are calculated for the face adjoining with the adjacent midpoints.\n\n\n\n\n\n","category":"method"},{"location":"#RigidBodyTools.jl","page":"Home","title":"RigidBodyTools.jl","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Tools for creating, moving, and discretizing rigid bodies","category":"page"},{"location":"","page":"Home","title":"Home","text":"The purpose of this package is to provide tools for rigid bodies with point-discretized surfaces. It includes methods for","category":"page"},{"location":"","page":"Home","title":"Home","text":"a library of surface shape definitions and associated point discretizations\ncalculation of geometric properties\nrigid-body motion and transformation of surface points\ncollections of multiple rigid bodies","category":"page"},{"location":"#Installation","page":"Home","title":"Installation","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"This package works on Julia 1.0 and above and is registered in the general Julia registry. To install from the REPL, type e.g.,","category":"page"},{"location":"","page":"Home","title":"Home","text":"] add RigidBodyTools","category":"page"},{"location":"","page":"Home","title":"Home","text":"Then, in any version, type","category":"page"},{"location":"","page":"Home","title":"Home","text":"julia> using RigidBodyTools","category":"page"},{"location":"","page":"Home","title":"Home","text":"The plots in this documentation are generated using Plots.jl. You might want to install that, too, to follow the examples.","category":"page"}]
}
