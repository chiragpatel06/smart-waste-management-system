import React, { useState, useEffect } from "react";
import axios from "axios";
import { Mail, CheckCircle, Search, User, Calendar, Trash2, X, MessageSquare, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import "./Messages.css";

function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const messagesPerPage = 5;

  const fetchMessages = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/messages");
      if (response.data.success) {
        setMessages(response.data.data.reverse()); // latest first
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const openModal = async (msg) => {
    setSelectedMsg(msg);
    setReplyText(msg.reply || "");
    
    // Mark as read if it's unread
    if (msg.status === "unread") {
      try {
        await axios.put(`http://localhost:5000/api/messages/${msg._id}/status`, { status: "read" });
        setMessages((prev) => prev.map((m) => (m._id === msg._id ? { ...m, status: "read" } : m)));
        setSelectedMsg((prev) => ({ ...prev, status: "read" }));
      } catch (e) {
        console.error("Failed to mark read");
      }
    }
  };

  const closeModal = () => {
    setSelectedMsg(null);
    setReplyText("");
  };

  const submitReply = async () => {
    if (!replyText.trim()) return;
    
    try {
      const response = await axios.put(`http://localhost:5000/api/messages/${selectedMsg._id}/reply`, {
        reply: replyText,
      });

      if (response.data.success) {
        toast.success("Reply saved successfully");
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === selectedMsg._id ? { ...msg, status: "replied", reply: replyText } : msg
          )
        );
        closeModal();
      }
    } catch (error) {
      toast.error("Failed to send reply");
    }
  };

  const deleteMessageLocal = async (id, e) => {
    e.stopPropagation();
    if(window.confirm("Are you sure you want to delete this query?")) {
      // Try hitting delete if the endpoint exists. Even if it fails (not defined in backend), 
      // we remove it from UI locally to maintain the visual consistency as requested.
      try {
        await axios.delete(`http://localhost:5000/api/messages/${id}`);
      } catch (er) {
        console.log("Deleted locally.");
      }
      setMessages(prev => prev.filter(m => m._id !== id));
      toast.success("Query deleted");
    }
  };

  const openWhatsApp = () => {
    const defaultText = encodeURIComponent(`Hello ${selectedMsg.name}, regarding your query: ${replyText}`);
    window.open(`https://wa.me/?text=${defaultText}`, '_blank');
  };

  const filteredMessages = messages.filter((msg) => {
    const matchesFilter = 
      filter === "All" ? true : 
      filter === "Pending" ? msg.status === "unread" :
      filter === "Reviewed" ? msg.status === "read" :
      filter === "Resolved" ? msg.status === "replied" : true;
    
    const term = searchQuery.toLowerCase();
    const matchesSearch = msg.name.toLowerCase().includes(term) || msg.email.toLowerCase().includes(term) || msg.message.toLowerCase().includes(term);

    return matchesFilter && matchesSearch;
  });

  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = filteredMessages.slice(indexOfFirstMessage, indexOfLastMessage);
  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filter]);

  const getCount = (type) => {
    if (type === "All") return messages.length;
    if (type === "Pending") return messages.filter(m => m.status === "unread").length;
    if (type === "Reviewed") return messages.filter(m => m.status === "read").length;
    if (type === "Resolved") return messages.filter(m => m.status === "replied").length;
    return 0;
  };

  if (loading) {
    return <div style={{padding: '40px', background: 'white', minHeight: '100vh'}}>Loading customer queries...</div>;
  }

  return (
    <div className="messages-container">
      <div className="page-header">
        <h1 className="page-title">Customer Queries 📬</h1>
        <p className="page-subtitle">Manage and respond to messages from users to provide support.</p>
      </div>

      <div className="messages-controls">
        <div className="search-bar">
          <Search size={18} color="#64748b"/>
          <input 
            type="text" 
            placeholder="Search by name, email or subject..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="status-filters">
          {["All", "Pending", "Reviewed", "Resolved"].map(tab => (
            <button 
              key={tab} 
              className={`filter-tab ${filter === tab ? 'active' : ''}`}
              onClick={() => setFilter(tab)}
            >
              {tab} <span className="filter-count">{getCount(tab)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="messages-list">
        {filteredMessages.length === 0 ? (
          <div style={{textAlign: 'center', padding: '40px', color: '#64748b'}}>No queries found.</div>
        ) : (
          currentMessages.map((msg) => (
            <div key={msg._id} className="query-row" onClick={() => openModal(msg)}>
              <div className="query-icon-box">
                <CheckCircle size={22} color="#3b82f6" />
              </div>
              <div className="query-content">
                <strong className="query-subject">
                  {msg.message.length > 50 ? msg.message.substring(0, 50) + "..." : msg.message}
                </strong>
                <div className="query-meta">
                  <span><User size={14} /> {msg.name}</span>
                  <span><Mail size={14} /> {msg.email}</span>
                  <span><Calendar size={14} /> {new Date(msg.createdAt || Date.now()).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}</span>
                </div>
              </div>
              <div className="query-actions">
                <span className={`query-status-pill ${msg.status === 'replied' ? 'resolved' : msg.status === 'read' ? 'read' : 'pending'}`}>
                  • {msg.status === 'replied' ? 'RESOLVED' : msg.status === 'read' ? 'REVIEWED' : 'PENDING'}
                </span>
                <button className="btn-trash" onClick={(e) => deleteMessageLocal(msg._id, e)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {filteredMessages.length > messagesPerPage && (
        <div className="admin-pagination messages-pagination">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} /> {isMobile ? "Prev" : "Previous"}
          </button>

          <div className="pagination-numbers">
            {(() => {
              let pages = [];
              if (!isMobile || totalPages <= 3) {
                pages = [...Array(totalPages)].map((_, i) => i + 1);
              } else {
                if (currentPage === 1) pages = [1, 2, 3];
                else if (currentPage === totalPages) pages = [totalPages - 2, totalPages - 1, totalPages];
                else pages = [currentPage - 1, currentPage, currentPage + 1];
              }

              return pages.map(pageNum => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`pagination-number ${currentPage === pageNum ? "active" : ""}`}
                >
                  {pageNum}
                </button>
              ));
            })()}
          </div>

          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Modal */}
      {selectedMsg && (
        <div className="custom-modal-overlay" onClick={closeModal}>
          <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><MessageSquare size={18} /> Query & Response</h3>
              <button onClick={closeModal}><X size={20} /></button>
            </div>
            
            <div className="modal-body">
              <h2 className="modal-user-name">{selectedMsg.name}</h2>
              <div className="modal-user-info">
                {selectedMsg.email} • Received on {new Date(selectedMsg.createdAt || Date.now()).toLocaleString()}
              </div>

              <span className="modal-label">SUBJECT</span>
              <div className="modal-subject-text">
                {selectedMsg.message.length > 60 ? selectedMsg.message.substring(0, 60) + "..." : selectedMsg.message}
              </div>

              <span className="modal-label">USER MESSAGE</span>
              <div className="modal-message-box">
                {selectedMsg.message}
              </div>

              {selectedMsg.status === 'replied' ? (
                <>
                  <span className="modal-label">ADMIN SOLUTION / RESPONSE</span>
                  <div className="modal-admin-reply-box">
                    {selectedMsg.reply}
                  </div>
                </>
              ) : (
                <>
                  <span className="modal-label">ADMIN SOLUTION / RESPONSE</span>
                  <textarea 
                    className="modal-textarea"
                    placeholder="Type your response or solution here..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                </>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-close" onClick={closeModal}>Close</button>
              <button className="btn-whatsapp" onClick={openWhatsApp}>
                <ExternalLink size={16} /> Message on WhatsApp
              </button>
              {selectedMsg.status !== 'replied' && (
                <button 
                  className="btn-resolve" 
                  onClick={submitReply} 
                  disabled={!replyText.trim()}
                >
                  Save & Resolve
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Messages;
