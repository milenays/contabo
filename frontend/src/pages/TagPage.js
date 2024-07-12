import React, { useState, useEffect, useCallback } from 'react';
import { getTags, addTag, updateTag, deleteTag } from '../api/tagApi';
import TagForm from '../components/TagForm';
import TagList from '../components/TagList';
import { Button } from "../components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../components/ui/sheet"
import { useToast } from "../components/ui/use-toast"
import { PlusIcon } from 'lucide-react';

const TagsPage = () => {
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const itemsPerPage = 10;

  const fetchTags = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTags();
      setTags(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch tags",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = () => {
    setSelectedTag(null);
    setSheetOpen(true);
  };

  const handleEdit = (tag) => {
    setSelectedTag(tag);
    setSheetOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteTag(id);
      await fetchTags();
      toast({
        title: "Success",
        description: "Tag deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete tag",
      });
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      if (selectedTag) {
        await updateTag(selectedTag._id, values);
      } else {
        await addTag(values);
      }
      await fetchTags();
      setSheetOpen(false);
      toast({
        title: "Success",
        description: "Tag saved successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save tag",
      });
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTags = tags.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(tags.length / itemsPerPage);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Tags</h2>
        <Button onClick={handleAdd}>
          <PlusIcon className="mr-2 h-4 w-4" /> Add Tag
        </Button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <TagList
          tags={currentTags}
          onEdit={handleEdit}
          onDelete={handleDelete}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{selectedTag ? 'Edit Tag' : 'Add Tag'}</SheetTitle>
          </SheetHeader>
          <TagForm
            tag={selectedTag}
            onSubmit={handleFormSubmit}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default TagsPage;