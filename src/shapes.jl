using Dierckx
using Statistics: mean

export BasicBody,Ellipse,Circle,Rectangle,Square,Plate,SplinedBody,NACA4

"""
    BasicBody(x,y[,closuretype=ClosedBody]) <: Body

Construct a body by simply passing in the `x` and `y` coordinate vectors. The last
point will be automatically connected to the first point. The coordinate vectors
are assumed to be expressed in the body-fixed coordinate system. The optional
`closuretype` specifies whether the body is closed (`ClosedBody`) or open (`OpenBody`).
If closed, then the first and last points are assumed joined in operations that
require neighbor points.
"""
mutable struct BasicBody{N,C<:BodyClosureType} <: Body{N,C}
  cent :: Tuple{Float64,Float64}
  α :: Float64

  x̃ :: Vector{Float64}
  ỹ :: Vector{Float64}

  x :: Vector{Float64}
  y :: Vector{Float64}

end

function BasicBody(x::Vector{T},y::Vector{T};closuretype::Type{<:BodyClosureType}=ClosedBody) where {T <: Real}
    @assert length(x) == length(y)
    BasicBody{length(x),closuretype}((0.0,0.0),0.0,x,y,x,y)
end

function Base.show(io::IO, body::BasicBody{N,C}) where {N,C}
    println(io, "Basic pointwise-specified body with $N points")
    println(io, "   Current position: ($(body.cent[1]),$(body.cent[2]))")
    println(io, "   Current angle (rad): $(body.α)")
end



#### Ellipses and circles ####

"""
    Ellipse(a,b,n) <: Body

Construct an elliptical body with semi-major axis `a` and semi-minor axis `b`,
with `n` points distributed on the body perimeter.
"""
mutable struct Ellipse{N} <: Body{N,ClosedBody}
  a :: Float64
  b :: Float64
  cent :: Tuple{Float64,Float64}
  α :: Float64

  x̃ :: Vector{Float64}
  ỹ :: Vector{Float64}

  x :: Vector{Float64}
  y :: Vector{Float64}

end

function Ellipse(a::Real,b::Real,N::Int)
    x̃ = zeros(N)
    ỹ = zeros(N)
    θ = range(0,stop=2π,length=N+1)
    @. x̃ = a*cos(θ[1:N])
    @. ỹ = b*sin(θ[1:N])


    Ellipse{N}(a,b,(0.0,0.0),0.0,x̃,ỹ,x̃,ỹ)
end


#Ellipse(a::Real,b::Real,targetsize::Float64;kwargs...) =
#    Ellipse(a,b,_adjustnumber(targetsize,Ellipse,a,b);kwargs...)

"""
    Circle(a,n) <: Body

Construct a circular body with radius `a`
and with `n` points distributed on the body perimeter.
"""
Circle(a::Real,N::Int) = Ellipse(a,a,N)

"""
    Circle(a,targetsize::Float64) <: Body

Construct a circular body with radius `a` with spacing between points set
approximately to `targetsize`.
"""
Circle(a::Real,targetsize::Float64) = Ellipse(a,a,targetsize)

function Base.show(io::IO, body::Ellipse{N}) where {N}
    if body.a == body.b
      println(io, "Circular body with $N points and radius $(body.a)")
    else
      println(io, "Elliptical body with $N points and semi-axes ($(body.a),$(body.b))")
    end
    println(io, "   Current position: ($(body.cent[1]),$(body.cent[2]))")
    println(io, "   Current angle (rad): $(body.α)")
end

#### Rectangles and squares ####


"""
    Rectangle(a,b,na) <: Body

Construct a rectangular body with x̃ side half-length `a` and ỹ side half-length `b`,
with `na` points distributed on the x̃ side (including both corners). The centroid
of the rectangle is placed at the origin (so that the lower left corner is at (-a,-b)).

By default, points are placed at the corners, and the normal vectors are bisectors
between the normals on the adjacent two sides. If the `shifted=true` flag is added,
then the points are shifted counterclockwise by half a segment, so no points
are placed on the corners, and all normals are perpendicular to the sides.
"""
mutable struct Rectangle{N,PS} <: Body{N,ClosedBody}
  a :: Float64
  b :: Float64
  cent :: Tuple{Float64,Float64}
  α :: Float64

  x̃ :: Vector{Float64}
  ỹ :: Vector{Float64}

  x :: Vector{Float64}
  y :: Vector{Float64}

  x̃mid :: Union{Vector{Float64},Nothing}
  ỹmid :: Union{Vector{Float64},Nothing}

  xmid :: Union{Vector{Float64},Nothing}
  ymid :: Union{Vector{Float64},Nothing}

end

Rectangle(a::Real,b::Real,na::Int;shifted=false) = _rectangle(a,b,na,Val(shifted))

function _rectangle(a::Real,b::Real,na::Int,::Val{false})
    x̃, ỹ = _rectangle_points(a::Real,b::Real,na::Int)
    Rectangle{length(x̃),Unshifted}(a,b,(0.0,0.0),0.0,x̃,ỹ,x̃,ỹ,nothing,nothing,nothing,nothing)
end

function _rectangle(a::Real,b::Real,na::Int,::Val{true})
    x̃mid, ỹmid = _rectangle_points(a::Real,b::Real,na::Int)
    x̃, ỹ = _midpoints(x̃mid,ỹmid,ClosedBody)
    Rectangle{length(x̃),Shifted}(a,b,(0.0,0.0),0.0,x̃,ỹ,x̃,ỹ,x̃mid,ỹmid,x̃mid,ỹmid)
end

function _rectangle_points(a::Real,b::Real,na::Int)
  Δsa = 2a/(na-1)
  nb = ceil(Int,2b/Δsa)+1
  Δsb = 2b/(nb-1)

  N = 2(na-1)+2(nb-1)
  x = zeros(N)
  y = zeros(N)

  @. x[1:na-1] = -a + Δsa*(0:na-2)
  @. y[1:na-1] = -b

  @. x[na:na+nb-2] =  a
  @. y[na:na+nb-2] = -b + Δsb*(0:nb-2)

  @. x[(na+nb-1):(2na+nb-3)] = -a + Δsa*(na-1:-1:1)
  @. y[(na+nb-1):(2na+nb-3)] = b

  @. x[(2na+nb-2):(2na+2nb-4)] = -a
  @. y[(2na+nb-2):(2na+2nb-4)] =  -b + Δsb*(nb-1:-1:1)

  return x, y

end

#Rectangle(a::Real,b::Real,targetsize::Float64;kwargs...) =
#    Rectangle(a,b,_adjustnumber(targetsize,Rectangle,a,b);kwargs...)

centraldiff(b::Rectangle{N,Shifted}) where {N} = _diff(b.xmid,b.ymid,ClosedBody)


function (T::RigidTransform)(b::Rectangle{N,Shifted}) where {N}
  b.xmid, b.ymid = T(b.x̃mid,b.ỹmid)
  b.x, b.y = T(b.x̃,b.ỹ)
  b.α = T.α
  b.cent = T.trans
  return b
end


"""
    Square(a,na) <: Body

Construct a square body with side half-length `a`
and with `na` points distributed on each side (including both corners).
"""
Square(a::Real,na::Int;kwargs...) = Rectangle(a,a,na;kwargs...)

Square(a::Real,targetsize::Float64;kwargs...) = Rectangle(a,a,targetsize;kwargs...)

function Base.show(io::IO, body::Rectangle{N}) where {N}
    if body.a == body.b
      println(io, "Square body with $N points and side half-length $(body.a)")
    else
      println(io, "Rectangular body with $N points and half-lengths ($(body.a),$(body.b))")
    end
    println(io, "   Current position: ($(body.cent[1]),$(body.cent[2]))")
    println(io, "   Current angle (rad): $(body.α)")
end

#### Plates ####

"""
    Plate(length,thick,n,[λ=1.0]) <: Body

Construct a flat plate with length `length` and thickness `thick`,
with `n` points distributed on the body perimeter.

The optional parameter `λ` distributes the points differently. Values between `0.0`
and `1.0` are accepted.

The constructor `Plate(length,n,[λ=1.0])` creates a plate of zero thickness.

Alternatively, either form can be specified with a target spacing in place of `n`.
"""
mutable struct Plate{N,C<:BodyClosureType} <: Body{N,C}
  len :: Float64
  thick :: Float64
  cent :: Tuple{Float64,Float64}
  α :: Float64

  x̃ :: Vector{Float64}
  ỹ :: Vector{Float64}

  x :: Vector{Float64}
  y :: Vector{Float64}

end


function Plate(len::Real,N::Int;λ::Float64=1.0)

    # set up points on plate
    #x = [[len*(-0.5 + 1.0*(i-1)/(N-1)),0.0] for i=1:N]

    Δϕ = π/(N-1)
    Jϕa = [sqrt(sin(ϕ)^2+λ^2*cos(ϕ)^2) for ϕ in range(π-Δϕ/2,stop=Δϕ/2,length=N-1)]
    Jϕ = len*Jϕa/Δϕ/sum(Jϕa)
    x̃ = -0.5*len .+ Δϕ*cumsum([0.0; Jϕ])
    ỹ = zero(x̃)

    Plate{N,OpenBody}(len,0.0,(0.0,0.0),0.0,x̃,ỹ,x̃,ỹ)

end

#Plate(a::Real,targetsize::Float64;kwargs...) =
#    Plate(a,_adjustnumber(targetsize,Plate,a);kwargs...)


function Plate(len::Real,thick::Real,N::Int;λ::Float64=1.0)
    # input N is the number of panels on one side only

    # set up points on flat sides
    Δϕ = π/N
    Jϕa = [sqrt(sin(ϕ)^2+λ^2*cos(ϕ)^2) for ϕ in range(π-Δϕ/2,stop=Δϕ/2,length=N)]
    Jϕ = len*Jϕa/Δϕ/sum(Jϕa)
    xtopface = -0.5*len .+ Δϕ*cumsum([0.0; Jϕ])
    xtop = 0.5*(xtopface[1:N] + xtopface[2:N+1])


    Δsₑ = Δϕ*Jϕ[1]
    Nₑ = 2*floor(Int,0.25*π*thick/Δsₑ)
    xedgeface = [0.5*len + 0.5*thick*cos(ϕ) for ϕ in range(π/2,stop=-π/2,length=Nₑ+1)]
    yedgeface = [          0.5*thick*sin(ϕ) for ϕ in range(π/2,stop=-π/2,length=Nₑ+1)]
    xedge = 0.5*(xedgeface[1:Nₑ]+xedgeface[2:Nₑ+1])
    yedge = 0.5*(yedgeface[1:Nₑ]+yedgeface[2:Nₑ+1])

    x̃ = Float64[]
    ỹ = Float64[]
    for xi in xtop
      push!(x̃,xi)
      push!(ỹ,0.5*thick)
    end
    for i = 1:Nₑ
      push!(x̃,xedge[i])
      push!(ỹ,yedge[i])
    end
    for xi in reverse(xtop,dims=1)
      push!(x̃,xi)
      push!(ỹ,-0.5*thick)
    end
    for i = Nₑ:-1:1
      push!(x̃,-xedge[i])
      push!(ỹ,yedge[i])
    end

    Plate{length(x̃),ClosedBody}(len,thick,(0.0,0.0),0.0,x̃,ỹ,x̃,ỹ)

end

#Plate(a::Real,b::Real,targetsize::Float64;kwargs...) =
#    Plate(a,b,_adjustnumber(targetsize,Plate,a,b);kwargs...)

function Base.show(io::IO, body::Plate{N}) where {N}
    println(io, "Plate with $N points and length $(body.len) and thickness $(body.thick)")
    println(io, "   Current position: ($(body.cent[1]),$(body.cent[2]))")
    println(io, "   Current angle (rad): $(body.α)")
end

#### Splined body ####


"""
    SplinedBody(X,Δx[,closuretype=ClosedBody]) -> BasicBody

Using control points in `X` (assumed to be N x 2, where N is the number of points), create a set of points
that are uniformly spaced (with spacing `Δx`) on a curve that passes through the control points. A cubic
parametric spline algorithm is used. If the optional parameter `closuretype` is set
to `OpenBody`, then the end points are not joined together.
"""
function SplinedBody(Xpts_raw::Array{Float64,2},Δx::Float64;closuretype::Type{<:BodyClosureType}=ClosedBody)
    # Assume Xpts are in the form N x 2
    Xpts = copy(Xpts_raw)
    if Xpts[1,:] != Xpts[end,:]
        Xpts = vcat(Xpts,Xpts[1,:]')
    end

    spl = (closuretype == ClosedBody) ? ParametricSpline(Xpts',periodic=true) : ParametricSpline(Xpts')
    tfine = range(0,1,length=1001)
    dX = derivative(spl,tfine)

    np = ceil(Int,sqrt(sum(dX.^2)*(tfine[2]-tfine[1]))/Δx)

    tsamp = range(0,1,length=np)
    x = [X[1] for X in spl.(tsamp[1:end-1])]
    y = [X[2] for X in spl.(tsamp[1:end-1])]

    return BasicBody(x,y,closuretype=closuretype)
end

#### NACA 4-digit airfoil ####

"""
    NACA4(cam,pos,thick,np,[len=1.0]) <: Body{N}

Generates points in the shape of a NACA 4-digit airfoil of chord length 1. The
relative camber is specified by `cam`, the position of
maximum camber (as fraction of chord) by `pos`, and the relative thickness
by `thick`. The parameter `np` specifies the number of points on the upper
or lower surface. The optional parameter `len` specifies the chord length,
which defaults to 1.0.

# Example

```jldoctest
julia> w = Bodies.NACA4(0.0,0.0,0.12);
```
"""
mutable struct NACA4{N} <: Body{N,ClosedBody}
  len :: Float64
  camber :: Float64
  pos :: Float64
  thick :: Float64

  cent :: Tuple{Float64,Float64}
  α :: Float64

  x̃ :: Vector{Float64}
  ỹ :: Vector{Float64}

  x :: Vector{Float64}
  y :: Vector{Float64}

end


function NACA4(cam::Real,pos::Real,t::Real,np::Int;len=1.0)

# Here, cam is the fractional camber, pos is the fractional chordwise position
# of max camber, and t is the fractional thickness.

npan = 2*np-2

# Trailing edge bunching
an = 1.5
anp = an+1
x = zeros(np)

θ = zeros(size(x))
yc = zeros(size(x))

for j = 1:np
    frac = Float64((j-1)/(np-1))
    x[j] = 1 - anp*frac*(1-frac)^an-(1-frac)^anp;
    if x[j] < pos
        yc[j] = cam/pos^2*(2*pos*x[j]-x[j]^2)
        if pos > 0
            θ[j] = atan(2*cam/pos*(1-x[j]/pos))
        end
    else
        yc[j] = cam/(1-pos)^2*((1-2*pos)+2*pos*x[j]-x[j]^2)
        if pos > 0
            θ[j] = atan(2*cam*pos/(1-pos)^2*(1-x[j]/pos))
        end
    end
end

xu = zeros(size(x))
yu = xu
xl = xu
yl = yu

yt = t/0.20*(0.29690*sqrt.(x)-0.12600*x-0.35160*x.^2+0.28430*x.^3-0.10150*x.^4)

xu = x-yt.*sin.(θ)
yu = yc+yt.*cos.(θ)

xl = x+yt.*sin.(θ)
yl = yc-yt.*cos.(θ)

rt = 1.1019*t^2;
θ0 = 0
if pos > 0
    θ0 = atan(2*cam/pos)
end
# Center of leading edge radius
xrc = rt*cos(θ0)
yrc = rt*sin(θ0)
θle = collect(0:π/50:2π)
xlec = xrc .+ rt*cos.(θle)
ylec = yrc .+ rt*sin.(θle)

# Assemble data
coords = [xu yu xl yl x yc]
cole = [xlec ylec]

# Close the trailing edge
xpanold = [0.5*(xl[np]+xu[np]); reverse(xl[2:np-1],dims=1); xu[1:np-1]]
ypanold = [0.5*(yl[np]+yu[np]); reverse(yl[2:np-1],dims=1); yu[1:np-1]]

xpan = zeros(npan)
ypan = zeros(npan)
for ipan = 1:npan
    if ipan < npan
        xpan1 = xpanold[ipan]
        ypan1 = ypanold[ipan]
        xpan2 = xpanold[ipan+1]
        ypan2 = ypanold[ipan+1]
    else
        xpan1 = xpanold[npan]
        ypan1 = ypanold[npan]
        xpan2 = xpanold[1]
        ypan2 = ypanold[1]
    end
    xpan[ipan] = 0.5*(xpan1+xpan2)
    ypan[ipan] = 0.5*(ypan1+ypan2)
end
w = ComplexF64[1;reverse(xpan,dims=1)+im*reverse(ypan,dims=1)]*len
w .-= mean(w)

x̃ = real.(w)
ỹ = imag.(w)


NACA4{length(x̃)}(len,cam,pos,t,(0.0,0.0),0.0,x̃,ỹ,x̃,ỹ)

end

#NACA4(a::Real,b::Real,c::Real,targetsize::Float64;kwargs...) =
#    NACA4(a,b,c,_adjustnumber(targetsize,NACA4,a,b,c);kwargs...)


function Base.show(io::IO, body::NACA4{N}) where {N}
    println(io, "NACA 4-digit airfoil with $N points and length $(body.len) and thickness $(body.thick)")
    println(io, "   Current position: ($(body.cent[1]),$(body.cent[2]))")
    println(io, "   Current angle (rad): $(body.α)")
end


####

function _adjustnumber(targetsize::Real,shapefcn::Type{T},params...;kwargs...) where {T <: Body}
    ntrial = 501
    return floor(Int,ntrial*mean(dlength(shapefcn(params...,ntrial;kwargs...)))/targetsize)
end

for shape in (:Ellipse,:Rectangle,:Plate,:NACA4)
    @eval RigidBodyTools.$shape(params...;kwargs...) =
        $shape(Base.front(params)...,
          _adjustnumber(Base.last(params),$shape,Base.front(params)...;kwargs...);kwargs...)
end
