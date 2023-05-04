      implicit double precision(a-h,o-z)
	dimension eta(-1:100),eta_2022(-1:100)
	nmax=50

	write(50,*)
	write(50,*)'         sz                   z            i  ',
     !  '         eta(i)          eta_2022(i)         rel. diff.'
	write(50,*)
	do iomega=0,57
	  sz=4-.5d0*iomega
	  if(sz.gt.0)z=sz*sz
	  if(sz.le.0)z=-sz*sz

          call gebasev(z,eta,nmax+2)
          call gebasev_2022(z,eta_2022,nmax+2)
	  do i=-1,nmax
	    iwrt=0 ; 
     !      iwrt=1
	    reldiff=(eta(i)-eta_2022(i))/eta(i)
	    write(*,*)sz,'   ',z,'  ',i,'  ',eta(i),eta_2022(i),reldiff
	    write(50,*)sz,'   ',z,'  ',i,'  ',eta(i),eta_2022(i),reldiff
	    if(dabs(reldiff).gt.1.d-14) then
	      write(*,*)' attn: |rel. diff| > 1.d-14 '
	      write(50,*)' attn: |rel. diff| > 1.d-14 '
c	      pause
	    endif
	  enddo
	  write(*,*)
	  write(50,*)
	enddo
	stop
	end

      subroutine gebasev(z,eta,nmax)
c	for given double precision z and integer nmax > 1, this returns the double
c	precision values of \eta_i(z) (i=-1,0,1,...,nmax) in vector eta. the value
c	of \eta_i(z) is found in eta(i).
      implicit double precision(a-h,o-z)
	dimension eta(-1:*)
	dimension wght(2,0:30),e(0:2)
      u=abs(z)                                                         
	icut=(u-6.d0)/16.d0
	imax=nmax
	if(icut.lt.nmax)then
	  imax=3*nmax/2
	else
	  icut=imax
	endif
	if(icut.ne.imax)then
	  wght(2,0)=1.d0
	  fact=2.d0*imax+1.d0
	  do m=1,imax-1
	    wght(2,0)=wght(2,0)/(2.d0*m+1.d0)
	  enddo
	  wght(1,0)=wght(2,0)/fact
	  jmax=30
	  do k=1,2
	    do j=1,jmax
	      wght(k,j)=0.5d0*wght(k,j-1)/((2.d0*(j-k+1)+fact)*j)
	    enddo
	    i=3-k
	    e(i)=0.d0
	    do j=jmax,0,-1
	      e(i)=wght(k,j)+e(i)*z
	    enddo
	  enddo
	  do i=imax-2,nmax-1,-1
	    e(0)=z*e(2)+(2*i+3)*e(1)
	    e(2)=e(1)
	    e(1)=e(0)
	  enddo
	  eta(nmax)=e(2)
	  eta(nmax-1)=e(1)
	  do i=nmax-2,-1,-1
	    eta(i)=z*eta(i+2)+(2*i+3)*eta(i+1)
	  enddo
	  return
	endif
      squ=sqrt(u)
      if(z.le.0.d0)then 
        eta(0)=sin(squ)/squ
        eta(-1)=cos(squ)
	else
        eta(0)=sinh(squ)/squ
        eta(-1)=cosh(squ)
	endif
      do  i=1,icut
        eta(i)=(eta(i-2)-(2*i-1)*eta(i-1))/z
	enddo
      return
      end


        subroutine gebasev_2022(z,eta,ismax)
        implicit double precision(a-h,o-z)
	dimension eta(-1:*),f(0:30),eta_loc(-1:1),iq_ext_max(0:1)

c
c   this sbr. computes the values of eta_is(Z), is=-1,0,1,2,...,ismax.
c   optimal for |Z|< 600 and ismax < 149

c   input       : z, ismax
c   output      : vector eta(is), is=-1,0,1,2,...,ismax
c
c
c is_end is a big value of argument is which secures accurate computation by 
c  power series of eta(is_end) and eta(is_end-1)
c
	is_end=max((dabs(z)+6)/4.d0,REAL(ismax))
	if(is_end.gt.150)is_end=150
c
c computation through series of eta(is_end) and eta(is_end-1)
c
	iqmax=30

	do is_ext=0,1
	  isloc=is_end-1+is_ext ; fis=2*isloc+1
	  if(is_ext.eq.0) then
	    w0=1.d0
	    do i=0,isloc
	      w0=w0*(2*i+1)
	    enddo
	    w0=1.d0/w0
	  endif
	  if(is_ext.eq.1)w0=w0/(2*isloc+1)
c
c compute the maximum number of terms iq_ext_max(is_ext) to be used in the power expansion
c
	  f(0)=1.d0
	  iq2=0
	  do iq=1,iqmax
	    iq2=iq2+2 ; f(iq)=z*f(iq-1)/(iq2*(iq2+fis))
	    if(dabs(f(iq)).lt.1.d-16.and.dabs(f(iq-1)).gt.1.d-16)
     !      iq_ext_max(is_ext)=iq+1
	  enddo
c
c  power expansion sum
c
	  sump=0.d0 ; sumn=0.d0
	  do i=0,iq_ext_max(is_ext)-1,2
	    sump=sump+f(i) ; sumn=sumn+f(i+1)
	  enddo
	  sumpn=sump+sumn ; eta_loc(is_ext)=w0*sumpn

	enddo
c
c  the obtained eta_loc(1) and eta_loc(0) are just eta(is_end) and eta(is_end-1), resp.
c
c  backwards propagation of eta from is_end to ismax follows. only the values at ismax and ismax-1 are retained:
c 
	is2=2*is_end+1
	do is=is_end-1,ismax,-1
	  is2=is2-2
	  eta_loc(-1)=is2*eta_loc(0)+z*eta_loc(1)
	  eta_loc(1)=eta_loc(0) ; eta_loc(0)=eta_loc(-1)
	enddo
	eta(ismax)=eta_loc(1) ; if(ismax.eq.-1) return
	eta(ismax-1)=eta_loc(0) ; if(ismax.eq.0) return
c
c backwards generation of the other required eta(k),k=ismax-2,ismax-3,...,-1 : 
c
	is2=2*ismax+1
	acc_err=1.d0
	do is=ismax-1,0,-1
	  is2=is2-2 ; eta(is-1)=is2*eta(is)+z*eta(is+1)
	enddo

	return
	end
