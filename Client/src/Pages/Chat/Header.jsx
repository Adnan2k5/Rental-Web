import { ArrowLeft, MoreVertical } from 'lucide-react'
import React, { useState } from 'react'
// Avatar component with profile picture and initials fallback
const Avatar = ({ user, size = "medium", className = "" }) => {
    const [imageError, setImageError] = useState(false)

    const sizeClasses = {
        small: { width: '32px', height: '32px', fontSize: '14px' },
        medium: { width: '48px', height: '48px', fontSize: '18px' },
        large: { width: '64px', height: '64px', fontSize: '24px' }
    }

    const getInitials = (name) => {
        if (!name) return "?"
        return name
            .split(" ")
            .map(word => word.charAt(0))
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    const handleImageError = () => {
        setImageError(true)
    }

    const style = {
        ...sizeClasses[size],
        borderRadius: '50%',
        overflow: 'hidden',
        border: '2px solid #4D39EE',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #4D39EE, #4FC3F7)',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
    }

    return (
        <div style={style} className={className}>
            {user?.profilePicture && !imageError ? (
                <img
                    src={user.profilePicture || "/placeholder.svg"}
                    alt={user.name || "User"}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={handleImageError}
                />
            ) : (
                <span style={{
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: sizeClasses[size].fontSize
                }}>
                    {getInitials(user?.name)}
                </span>
            )}
        </div>
    )
}

export default function Header({ productName, ownerName, user }) {
    const navigateBack = () => {
        window.history.back();
    };

    const headerStyle = {
        background: 'linear-gradient(to right, #151823, #1E2131)',
        borderBottom: '1px solid rgba(77, 57, 238, 0.2)',
        padding: window.innerWidth >= 768 ? '16px 24px' : '12px 16px',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    };

    const containerStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    };

    const leftSectionStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: window.innerWidth >= 768 ? '16px' : '12px',
        flex: 1,
        minWidth: 0
    };

    const backButtonStyle = {
        background: 'none',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        padding: '8px',
        borderRadius: '8px',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    const userInfoStyle = {
        transition: 'all 0.3s ease',
        minWidth: 0,
        flex: 1
    };

    const nameStyle = {
        color: 'white',
        fontWeight: 'bold',
        fontSize: window.innerWidth >= 768 ? '20px' : '18px',
        margin: 0,
        letterSpacing: '-0.025em',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    };

    const statusStyle = {
        color: '#9CA3AF',
        fontSize: window.innerWidth >= 768 ? '16px' : '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        margin: '2px 0 0 0',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    };

    const onlineIndicatorStyle = {
        display: 'inline-block',
        width: window.innerWidth >= 768 ? '8px' : '6px',
        height: window.innerWidth >= 768 ? '8px' : '6px',
        borderRadius: '50%',
        backgroundColor: '#10B981',
        animation: 'pulse 2s infinite',
        flexShrink: 0
    };

    const rightSectionStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    };

    const moreButtonStyle = {
        background: 'none',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        padding: '8px',
        borderRadius: '8px',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    return (
        <>
            <style>
                {`
                    @keyframes pulse {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.5; }
                    }
                `}
            </style>
            <div style={headerStyle}>
                <div style={containerStyle}>
                    <div style={leftSectionStyle}>
                        <button
                            style={backButtonStyle}
                            onClick={navigateBack}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#2A2D3A'
                                e.target.style.color = '#4D39EE'
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent'
                                e.target.style.color = 'white'
                            }}
                        >
                            <ArrowLeft size={window.innerWidth >= 768 ? 24 : 20} />
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
                            <Avatar
                                user={user}
                                size={window.innerWidth >= 768 ? "medium" : "small"}
                                style={{
                                    transform: 'scale(1)',
                                    transition: 'transform 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = 'scale(1.05)'
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'scale(1)'
                                }}
                            />
                            <div style={userInfoStyle}>
                                <h1 style={nameStyle}>{productName}</h1>
                                <p style={statusStyle}>
                                    <span style={onlineIndicatorStyle}></span>
                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {ownerName}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div style={rightSectionStyle}>
                        <button
                            style={moreButtonStyle}
                            title="More options"
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#2A2D3A'
                                e.target.style.color = '#4D39EE'
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent'
                                e.target.style.color = 'white'
                            }}
                        >
                            <MoreVertical size={window.innerWidth >= 768 ? 24 : 20} />
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
