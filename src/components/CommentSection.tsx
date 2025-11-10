'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  spoilerConsent: boolean;
  user: {
    username: string;
  };
}

interface CommentSectionProps {
  mysteryId: string;
}

export default function CommentSection({ mysteryId }: CommentSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [spoilerConsent, setSpoilerConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [userComment, setUserComment] = useState<Comment | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch comments
  useEffect(() => {
    fetchComments();
  }, [mysteryId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/comments?mysteryId=${mysteryId}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
        
        // Check if current user already has a comment
        if (session?.user?.id) {
          const existing = data.find((comment: Comment) => 
            comment.user.username === session.user?.username
          );
          setUserComment(existing || null);
          // If editing, populate the form with existing comment
          if (existing && isEditing) {
            setNewComment(existing.content);
            setSpoilerConsent(existing.spoilerConsent);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.id) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (!newComment.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    if (!spoilerConsent) {
      alert('스포일러 관련 동의가 필요합니다.');
      return;
    }

    setSubmitting(true);
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const response = await fetch('/api/comments', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mysteryId,
          content: newComment,
          spoilerConsent
        }),
      });

      if (response.ok) {
        const commentData = await response.json();
        
        if (isEditing) {
          // Update existing comment in the list
          setComments(comments.map(comment => 
            comment.id === commentData.id ? commentData : comment
          ));
          setUserComment(commentData);
          setIsEditing(false);
        } else {
          // Add new comment to the list
          setComments([commentData, ...comments]);
          setUserComment(commentData);
        }
        
        setNewComment('');
        setSpoilerConsent(false);
      } else {
        const error = await response.json();
        alert(error.error || (isEditing ? '댓글 수정에 실패했습니다.' : '댓글 작성에 실패했습니다.'));
      }
    } catch (error) {
      console.error('Failed to submit comment:', error);
      alert(isEditing ? '댓글 수정 중 오류가 발생했습니다.' : '댓글 작성 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = () => {
    if (userComment) {
      setNewComment(userComment.content);
      setSpoilerConsent(userComment.spoilerConsent);
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewComment('');
    setSpoilerConsent(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">
          댓글 ({comments.length})
        </h3>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
        <p className="text-sm text-amber-800">
          ⚠️ 스포일러 관련 내용 기입 시 무통보 삭제될 수 있습니다.
        </p>
      </div>
      {/* Comment Form */}
      {session?.user && (!userComment || isEditing) && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="이 시나리오에 대한 의견을 남겨주세요..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              rows={4}
              maxLength={1000}
            />
            <div className="text-sm text-gray-500 mt-1">
              {newComment.length}/1000
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="spoilerConsent"
              checked={spoilerConsent}
              onChange={(e) => setSpoilerConsent(e.target.checked)}
              className="mt-1"
            />
            <label htmlFor="spoilerConsent" className="text-sm text-gray-700 leading-relaxed">
              스포일러와 관련된 내용을 작성하지 않았습니다
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="submit"
              disabled={!spoilerConsent || !newComment.trim() || submitting}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? (isEditing ? '수정 중...' : '작성 중...') : (isEditing ? '댓글 수정' : '댓글 작성')}
            </button>
            
            {isEditing && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                취소
              </button>
            )}
          </div>
        </form>
      )}

      {/* User already commented message */}
      {session?.user && userComment && !isEditing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="text-blue-800 font-medium">
                이미 이 시나리오에 댓글을 작성하셨습니다.
              </span>
            </div>
            <button
              onClick={handleEdit}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              수정
            </button>
          </div>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          <p className="mt-2 text-gray-600">댓글을 불러오는 중...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">
                  {comment.user.username}
                </span>
                <span className="text-sm text-gray-500">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Login prompt */}
      {!session?.user && (
        <div className="text-center py-8 text-gray-500">
          댓글을 작성하려면 <a href="/auth/signin" className="text-red-600 hover:underline">로그인</a>해주세요.
        </div>
      )}
    </div>
  );
}