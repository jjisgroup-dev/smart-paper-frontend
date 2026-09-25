import { ChangeEvent, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Check,
  CheckCircle2,
  Copy,
  Edit3,
  ImagePlus,
  Plus,
  Trash2,
  UserRound,
  School,
  BookOpen,
  Sparkles,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  emptyTeacherProfile,
  createNewProfile,
  TeacherProfile,
  useTeacherProfile,
} from '@/hooks/useTeacherProfile';
import { toast } from 'sonner';

const Profile = () => {
  const {
    profile: activeProfile,
    profiles,
    activeProfileId,
    setActiveProfileId,
    addProfile,
    updateProfile,
    deleteProfile,
    duplicateProfile,
  } = useTeacherProfile();

  // State for Add/Edit Modal
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [formData, setFormData] = useState<TeacherProfile>(emptyTeacherProfile);
  const [setAsActiveOnSave, setSetAsActiveOnSave] = useState(true);

  // State for Delete Confirmation Modal
  const [profileToDelete, setProfileToDelete] = useState<TeacherProfile | null>(null);

  // Open modal to add a brand new profile
  const handleOpenAddDialog = () => {
    const newEmpty = createNewProfile(`Profile ${profiles.length + 1}`);
    setFormData(newEmpty);
    setEditingProfileId(null);
    setSetAsActiveOnSave(true);
    setIsFormDialogOpen(true);
  };

  // Open modal to edit an existing profile
  const handleOpenEditDialog = (target: TeacherProfile) => {
    setFormData({ ...target });
    setEditingProfileId(target.id);
    setSetAsActiveOnSave(target.id === activeProfileId);
    setIsFormDialogOpen(true);
  };

  const updateField = (field: keyof TeacherProfile, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose a valid image file');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      updateField('photo', typeof reader.result === 'string' ? reader.result : '');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveForm = () => {
    const sanitizedLabel =
      formData.profileLabel.trim() ||
      (formData.teacherName.trim()
        ? `${formData.teacherName.trim()}${formData.subject ? ` (${formData.subject})` : ''}`
        : 'Untitled Profile');

    const profileToSave: TeacherProfile = {
      ...formData,
      profileLabel: sanitizedLabel,
    };

    if (editingProfileId) {
      // Editing existing profile
      updateProfile(editingProfileId, profileToSave);
      if (setAsActiveOnSave) {
        setActiveProfileId(editingProfileId);
      }
      toast.success(`Profile "${sanitizedLabel}" updated`);
    } else {
      // Adding new profile
      const created = addProfile(profileToSave, setAsActiveOnSave);
      toast.success(`New profile "${created.profileLabel}" created`);
    }

    setIsFormDialogOpen(false);
  };

  const handleDuplicate = (id: string) => {
    const duplicated = duplicateProfile(id);
    if (duplicated) {
      toast.success(`Profile duplicated as "${duplicated.profileLabel}"`);
    }
  };

  const handleConfirmDelete = () => {
    if (!profileToDelete) return;
    const label = profileToDelete.profileLabel || profileToDelete.teacherName || 'Profile';
    deleteProfile(profileToDelete.id);
    toast.success(`Profile "${label}" removed`);
    setProfileToDelete(null);
  };

  return (
    <PageLayout title="Teacher Profiles">
      <div className="container max-w-4xl px-4 py-6 space-y-6">
        {/* Header Hero */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-card rounded-2xl p-6 shadow-card border border-border/60">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Multi-Profile Management
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Teacher Profiles</h1>
            <p className="text-sm text-muted-foreground max-w-xl">
              Add and manage multiple profiles for different classes, subjects, or branches. The active profile will automatically appear on question papers and PDF exports.
            </p>
          </div>

          <Button
            onClick={handleOpenAddDialog}
            className="btn-primary-gradient shrink-0 shadow-md flex items-center gap-2 h-10 px-4"
          >
            <Plus className="h-4 w-4" />
            Add New Profile
          </Button>
        </div>

        {/* Active Profile Highlight Card */}
        {activeProfile && (
          <motion.div
            key={activeProfile.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl border-2 border-primary/40 bg-gradient-to-br from-card to-primary/5 p-6 shadow-card"
          >
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <Badge className="bg-primary hover:bg-primary text-primary-foreground flex items-center gap-1 text-xs py-1 px-2.5 shadow-sm">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Active on Papers
              </Badge>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative shrink-0">
                <div className="h-20 w-20 rounded-2xl overflow-hidden bg-primary/10 border-2 border-primary/20 flex items-center justify-center shadow-inner">
                  {activeProfile.photo ? (
                    <img
                      src={activeProfile.photo}
                      alt={activeProfile.teacherName || 'Teacher'}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserRound className="h-10 w-10 text-primary" />
                  )}
                </div>
              </div>

              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold text-foreground truncate">
                    {activeProfile.profileLabel || 'Active Profile'}
                  </h2>
                  {activeProfile.subject && (
                    <Badge variant="outline" className="text-xs font-medium">
                      {activeProfile.subject}
                    </Badge>
                  )}
                </div>

                <p className="text-sm font-medium text-foreground/90">
                  {activeProfile.teacherName ? (
                    <span className="flex items-center gap-1.5">
                      <UserRound className="h-3.5 w-3.5 text-muted-foreground" />
                      {activeProfile.teacherName}
                    </span>
                  ) : (
                    <span className="text-muted-foreground italic">No teacher name provided</span>
                  )}
                </p>

                <p className="text-xs text-muted-foreground flex items-center gap-1.5 truncate">
                  <School className="h-3.5 w-3.5 shrink-0" />
                  {activeProfile.schoolName || 'No school specified'}
                  {(activeProfile.standard || activeProfile.division) && (
                    <span className="inline-block ml-1">
                      · Class {activeProfile.standard || '-'}{activeProfile.division ? ` (Sec ${activeProfile.division})` : ''}
                    </span>
                  )}
                </p>

                {activeProfile.remarks && (
                  <p className="text-xs text-muted-foreground/90 bg-muted/40 p-2 rounded-lg mt-2 italic line-clamp-2">
                    &ldquo;{activeProfile.remarks}&rdquo;
                  </p>
                )}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-border/70 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground">
                Currently used on all question paper headers and downloads
              </span>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenEditDialog(activeProfile)}
                  className="flex items-center gap-1.5 h-8 text-xs font-medium"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit Profile
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDuplicate(activeProfile.id)}
                  className="flex items-center gap-1.5 h-8 text-xs text-muted-foreground hover:text-foreground"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Duplicate
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* All Profiles Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              All Saved Profiles ({profiles.length})
            </h3>
            <span className="text-xs text-muted-foreground">
              Click &quot;Set Active&quot; to switch active profile
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <AnimatePresence>
              {profiles.map((item) => {
                const isActive = item.id === activeProfileId;

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Card
                      className={`h-full transition-all duration-200 ${
                        isActive
                          ? 'border-primary/60 bg-card shadow-sm ring-1 ring-primary/30'
                          : 'border-border/70 bg-card/60 hover:bg-card hover:border-border hover:shadow-card'
                      }`}
                    >
                      <CardHeader className="p-4 pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="h-12 w-12 rounded-xl overflow-hidden bg-primary/10 border border-border flex items-center justify-center shrink-0">
                              {item.photo ? (
                                <img
                                  src={item.photo}
                                  alt={item.teacherName || item.profileLabel}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <UserRound className="h-6 w-6 text-primary" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <CardTitle className="text-base font-semibold truncate leading-tight">
                                {item.profileLabel || item.teacherName || 'Profile'}
                              </CardTitle>
                              <CardDescription className="text-xs truncate mt-0.5">
                                {item.teacherName || 'Teacher name not set'}
                              </CardDescription>
                            </div>
                          </div>

                          {isActive ? (
                            <Badge className="bg-primary/15 text-primary border-primary/20 text-[11px] font-semibold flex items-center gap-1 shrink-0 py-0.5">
                              <Check className="h-3 w-3" /> Active
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setActiveProfileId(item.id);
                                toast.success(`Switched to "${item.profileLabel}"`);
                              }}
                              className="text-xs h-7 px-2.5 font-medium hover:bg-primary/10 hover:text-primary hover:border-primary/40 shrink-0"
                            >
                              Set Active
                            </Button>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className="p-4 pt-2 space-y-3 text-xs">
                        <div className="grid grid-cols-2 gap-2 text-muted-foreground bg-muted/30 p-2.5 rounded-lg border border-border/40">
                          <div>
                            <span className="block text-[10px] uppercase font-semibold text-muted-foreground/70">
                              School
                            </span>
                            <span className="font-medium text-foreground truncate block">
                              {item.schoolName || '—'}
                            </span>
                          </div>
                          <div>
                            <span className="block text-[10px] uppercase font-semibold text-muted-foreground/70">
                              Class & Subject
                            </span>
                            <span className="font-medium text-foreground truncate block">
                              {item.standard ? `Class ${item.standard}` : ''}
                              {item.division ? ` (${item.division})` : ''}
                              {item.subject ? ` · ${item.subject}` : !item.standard ? '—' : ''}
                            </span>
                          </div>
                        </div>

                        {item.remarks && (
                          <p className="text-muted-foreground text-[11px] line-clamp-1 italic">
                            &ldquo;{item.remarks}&rdquo;
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-1 border-t border-border/50">
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleOpenEditDialog(item)}
                              className="h-7 px-2 text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground"
                            >
                              <Edit3 className="h-3 w-3" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDuplicate(item.id)}
                              className="h-7 px-2 text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground"
                            >
                              <Copy className="h-3 w-3" />
                              Duplicate
                            </Button>
                          </div>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setProfileToDelete(item)}
                            className="h-7 px-2 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive flex items-center gap-1"
                          >
                            <Trash2 className="h-3 w-3" />
                            Remove
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Quick Add Profile Card */}
            <div
              onClick={handleOpenAddDialog}
              className="border-2 border-dashed border-border/70 hover:border-primary/50 hover:bg-primary/5 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 group min-h-[170px]"
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Plus className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold text-foreground group-hover:text-primary">
                Add Another Profile
              </p>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                Create a customized header for another class, section, or subject
              </p>
            </div>
          </div>
        </div>

        {/* Live Question Paper Header Preview */}
        {activeProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="space-y-3 pt-2"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                <FileCheck className="h-4 w-4 text-primary" />
                Live Paper Header Preview
              </h3>
              <span className="text-[11px] text-muted-foreground">
                How this profile appears on your generated papers & PDFs
              </span>
            </div>

            <div className="bg-card rounded-xl p-5 shadow-card border border-border/60 text-center relative overflow-hidden">
              <div className="flex items-center justify-center gap-3 mb-2">
                {activeProfile.photo ? (
                  <img
                    src={activeProfile.photo}
                    alt="Teacher"
                    className="h-9 w-9 rounded-full object-cover border border-border"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center border border-border">
                    <UserRound className="h-5 w-5 text-primary" />
                  </div>
                )}
                <div>
                  <h4 className="text-base font-bold text-foreground">
                    {activeProfile.schoolName || 'YOUR SCHOOL / INSTITUTE NAME'}
                  </h4>
                </div>
              </div>

              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">
                CBSE · NCERT Pattern Examination
              </p>
              <h5 className="text-sm font-semibold text-foreground">
                Sample Question Paper Title
              </h5>
              <p className="text-xs text-muted-foreground mt-0.5">
                Class {activeProfile.standard || '10'} · {activeProfile.subject || 'Subject'}
                {activeProfile.division ? ` · Section ${activeProfile.division}` : ''}
              </p>
              {activeProfile.teacherName && (
                <p className="text-xs font-medium text-foreground/80 mt-1">
                  Prepared by: {activeProfile.teacherName}
                </p>
              )}

              <div className="flex items-center justify-center gap-6 text-xs border-t border-dashed border-border mt-3 pt-2.5 text-muted-foreground">
                <span>Maximum Marks: <strong className="text-foreground">80</strong></span>
                <span>Duration: <strong className="text-foreground">3 Hours</strong></span>
              </div>

              {activeProfile.remarks && (
                <div className="mt-2.5 pt-2 border-t border-border/40 text-xs text-muted-foreground italic">
                  Note: {activeProfile.remarks}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Add / Edit Profile Dialog Modal */}
        <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                {editingProfileId ? (
                  <>
                    <Edit3 className="h-5 w-5 text-primary" />
                    Edit Profile
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5 text-primary" />
                    Add New Teacher Profile
                  </>
                )}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Fill in the details below. These details are stored locally on your device and will be printed on question papers.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Profile Label */}
              <div className="space-y-1.5">
                <Label htmlFor="modal-profile-label" className="text-xs font-semibold">
                  Profile Label / Nickname <span className="text-primary">*</span>
                </Label>
                <Input
                  id="modal-profile-label"
                  value={formData.profileLabel}
                  onChange={(e) => updateField('profileLabel', e.target.value)}
                  placeholder="e.g. Class 10 Math, Morning Section, Priya Sharma"
                />
                <p className="text-[11px] text-muted-foreground">
                  A name to help you recognize this profile in the list.
                </p>
              </div>

              {/* Photo Upload */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Teacher Photo / School Logo</Label>
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-full overflow-hidden bg-primary/10 border border-border flex items-center justify-center shrink-0">
                    {formData.photo ? (
                      <img src={formData.photo} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                      <UserRound className="h-7 w-7 text-primary" />
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <label
                      htmlFor="modal-photo-upload"
                      className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-input bg-background hover:bg-accent text-xs font-medium"
                    >
                      <Camera className="h-3.5 w-3.5 text-primary" />
                      {formData.photo ? 'Change photo' : 'Upload photo'}
                    </label>
                    <input
                      id="modal-photo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                    {formData.photo && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => updateField('photo', '')}
                        className="text-xs h-8 text-destructive hover:text-destructive"
                      >
                        <ImagePlus className="h-3.5 w-3.5 mr-1" />
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Teacher & School Name */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="modal-teacher-name" className="text-xs font-semibold">
                    Teacher Name
                  </Label>
                  <Input
                    id="modal-teacher-name"
                    value={formData.teacherName}
                    onChange={(e) => updateField('teacherName', e.target.value)}
                    placeholder="e.g. Priya Sharma"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="modal-school-name" className="text-xs font-semibold">
                    School / Institute Name
                  </Label>
                  <Input
                    id="modal-school-name"
                    value={formData.schoolName}
                    onChange={(e) => updateField('schoolName', e.target.value)}
                    placeholder="e.g. Sunrise Public School"
                  />
                </div>
              </div>

              {/* Class & Division */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="modal-standard" className="text-xs font-semibold">
                    Standard / Class
                  </Label>
                  <Input
                    id="modal-standard"
                    value={formData.standard}
                    onChange={(e) => updateField('standard', e.target.value)}
                    placeholder="e.g. 10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="modal-division" className="text-xs font-semibold">
                    Division / Section
                  </Label>
                  <Input
                    id="modal-division"
                    value={formData.division}
                    onChange={(e) => updateField('division', e.target.value)}
                    placeholder="e.g. A"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <Label htmlFor="modal-subject" className="text-xs font-semibold">
                  Subject Taught
                </Label>
                <Input
                  id="modal-subject"
                  value={formData.subject}
                  onChange={(e) => updateField('subject', e.target.value)}
                  placeholder="e.g. Mathematics, English, Science"
                />
              </div>

              {/* Remarks */}
              <div className="space-y-1.5">
                <Label htmlFor="modal-remarks" className="text-xs font-semibold">
                  Paper Note / Instructions Remarks
                </Label>
                <Textarea
                  id="modal-remarks"
                  value={formData.remarks}
                  onChange={(e) => updateField('remarks', e.target.value)}
                  placeholder="e.g. Attempt all questions. Calculators not allowed."
                  rows={2}
                />
              </div>

              {/* Set as active checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="modal-set-active"
                  checked={setAsActiveOnSave}
                  onChange={(e) => setSetAsActiveOnSave(e.target.checked)}
                  className="rounded border-input text-primary focus:ring-primary h-4 w-4"
                />
                <Label htmlFor="modal-set-active" className="text-xs cursor-pointer select-none">
                  Set as active profile for question papers immediately
                </Label>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormDialogOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSaveForm}
                className="btn-primary-gradient text-xs flex items-center gap-1.5"
              >
                <Check className="h-4 w-4" />
                {editingProfileId ? 'Save Changes' : 'Create Profile'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Alert Dialog */}
        <AlertDialog
          open={!!profileToDelete}
          onOpenChange={(open) => {
            if (!open) setProfileToDelete(null);
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <div className="flex items-center gap-2 text-destructive mb-1">
                <AlertCircle className="h-5 w-5" />
                <AlertDialogTitle>Remove Profile?</AlertDialogTitle>
              </div>
              <AlertDialogDescription className="text-sm">
                Are you sure you want to remove &quot;
                <strong className="text-foreground">
                  {profileToDelete?.profileLabel || profileToDelete?.teacherName || 'this profile'}
                </strong>
                &quot;?
                {profiles.length === 1 ? (
                  <span className="block mt-2 text-amber-600 font-medium">
                    This is your only profile. Removing it will reset your profile details to blank.
                  </span>
                ) : (
                  <span className="block mt-2 text-muted-foreground">
                    This action cannot be undone. If this profile is currently active, another profile will become active automatically.
                  </span>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                Yes, Remove Profile
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PageLayout>
  );
};

export default Profile;
